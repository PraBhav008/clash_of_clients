/**
 * Citadel Dashboard - Cloudflare Worker Backend API
 *
 * Built with native Cloudflare D1 edge database bindings (env.DB).
 * No Cloudflare API tokens are ever exposed to the frontend browser.
 */

export interface Env {
  DB: D1Database;
  DASHBOARD_API_KEY?: string;
  CORS_ORIGIN?: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  JWT_SECRET?: string;
}

// SHA-256 password hash using standard WebCrypto
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder().encode('citadel_salt_2026_' + password);
  const hashBuf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Ensure auth table exists in D1 and seed default admin account
async function ensureAuthTable(env: Env) {
  try {
    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS citadel_auth (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    const defaultEmail = (env.ADMIN_EMAIL || 'raisstudio100k@gmail.com').trim().toLowerCase();
    const defaultPass = env.ADMIN_PASSWORD || 'close10clients';
    const hashed = await hashPassword(defaultPass);
    const now = new Date().toISOString();

    // Push & sync target admin credentials directly into Cloudflare D1 database
    await env.DB.prepare(
      'INSERT INTO citadel_auth (id, email, password_hash, role, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6) ON CONFLICT(id) DO UPDATE SET email = excluded.email, password_hash = excluded.password_hash, updated_at = excluded.updated_at;'
    ).bind('primary_admin', defaultEmail, hashed, 'admin', now, now).run();
  } catch (err) {
    console.warn('[AUTH] Error ensuring auth table:', err);
  }
}

// Signed session bearer token
async function generateAuthToken(email: string, role: string, env: Env): Promise<string> {
  const secret = env.JWT_SECRET || 'citadel_vault_secret_2026_edge_key';
  const payload = {
    email,
    role,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days session
  };
  const payloadStr = btoa(JSON.stringify(payload));
  const enc = new TextEncoder().encode(payloadStr + secret);
  const signBuf = await crypto.subtle.digest('SHA-256', enc);
  const signHex = Array.from(new Uint8Array(signBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .slice(0, 32)
    .join('');
  return `${payloadStr}.${signHex}`;
}

async function verifyAuthToken(token: string, env: Env): Promise<{ valid: boolean; email?: string; role?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };
    const [payloadStr, signHex] = parts;
    const secret = env.JWT_SECRET || 'citadel_vault_secret_2026_edge_key';
    const enc = new TextEncoder().encode(payloadStr + secret);
    const signBuf = await crypto.subtle.digest('SHA-256', enc);
    const expectedSign = Array.from(new Uint8Array(signBuf))
      .map(b => b.toString(16).padStart(2, '0'))
      .slice(0, 32)
      .join('');
    if (signHex !== expectedSign) return { valid: false };

    const payload = JSON.parse(atob(payloadStr));
    if (payload.exp && Date.now() > payload.exp) return { valid: false };
    return { valid: true, email: payload.email, role: payload.role };
  } catch {
    return { valid: false };
  }
}

async function isAuthorized(request: Request, env: Env): Promise<boolean> {
  const authHeader = request.headers.get('Authorization') || '';
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = bearerMatch ? bearerMatch[1].trim() : (request.headers.get('x-api-key') || '').trim();

  // If token matches worker secret DASHBOARD_API_KEY, authorize immediately
  if (env.DASHBOARD_API_KEY && token === env.DASHBOARD_API_KEY.trim()) {
    return true;
  }

  // Check if token is a valid signed session token
  if (token) {
    const verified = await verifyAuthToken(token, env);
    if (verified.valid) return true;
  }

  // If DASHBOARD_API_KEY is not set and no token, fallback to authorized for local setup if configured
  return false;
}

/**
 * Ensure the snapshot storage table exists in existing D1 database without modifying any other tables
 */
async function ensureTables(env: Env) {
  await env.DB.exec('CREATE TABLE IF NOT EXISTS citadel_sync (id TEXT PRIMARY KEY, updated_at TEXT NOT NULL, version TEXT NOT NULL, data TEXT NOT NULL);');
  await ensureAuthTable(env);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(env),
      });
    }

    // Root and version probes (unauthenticated for instant verification)
    if (path === '/' || path === '' || path === '/api/version') {
      return jsonResponse({
        success: true,
        service: "Citadel Edge API",
        version: "auth-sync-2026-v3",
        d1: "connected"
      }, 200, env);
    }

    // Health probe (unauthenticated so dashboard and monitoring can test connectivity)
    if (path === '/api/health' && method === 'GET') {
      try {
        const ping = await env.DB.prepare('SELECT 1 as ping, CURRENT_TIMESTAMP as cf_time;').first();
        return jsonResponse({
          success: true,
          message: 'Cloudflare Worker & D1 Database connected successfully!',
          d1: ping,
          timestamp: new Date().toISOString(),
        }, 200, env);
      } catch (err: any) {
        console.error('[HEALTH ERROR] D1 connection failed:', err);
        return errorResponse(`D1 Database connection error: ${err.message}`, 500, env);
      }
    }

    // =========================================================================
    // Authentication Endpoints
    // =========================================================================

    // POST /api/auth/login - Multi-device Admin Login
    if (path === '/api/auth/login' && method === 'POST') {
      try {
        await ensureAuthTable(env);
        const body = await request.json() as any;
        const email = (body.email || '').trim().toLowerCase();
        const password = (body.password || '').trim();

        if (!email || !password) {
          return errorResponse('Email and password are required', 400, env);
        }

        const hashed = await hashPassword(password);

        // Query D1 database
        let adminRecord = await env.DB.prepare(
          'SELECT id, email, password_hash, role FROM citadel_auth WHERE lower(email) = ?1 LIMIT 1;'
        ).bind(email).first<{ id: string; email: string; password_hash: string; role: string }>();

        // Default credentials fallback
        const defaultEmail = (env.ADMIN_EMAIL || 'raisstudio100k@gmail.com').trim().toLowerCase();
        const defaultPass = env.ADMIN_PASSWORD || 'close10clients';
        const isDefaultMatch = email === defaultEmail && password === defaultPass;

        if (!adminRecord && isDefaultMatch) {
          const now = new Date().toISOString();
          await env.DB.prepare(
            'INSERT OR REPLACE INTO citadel_auth (id, email, password_hash, role, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6);'
          ).bind('primary_admin', defaultEmail, hashed, 'admin', now, now).run();
          adminRecord = { id: 'primary_admin', email: defaultEmail, password_hash: hashed, role: 'admin' };
        }

        if (!adminRecord || (adminRecord.password_hash !== hashed && !isDefaultMatch)) {
          return jsonResponse({
            success: false,
            error: 'Invalid administrator email or password'
          }, 401, env);
        }

        const token = await generateAuthToken(adminRecord.email, adminRecord.role, env);

        return jsonResponse({
          success: true,
          message: 'Admin authentication successful',
          token,
          user: {
            email: adminRecord.email,
            role: adminRecord.role,
            name: 'Citadel Architect'
          }
        }, 200, env);
      } catch (err: any) {
        console.error('[AUTH ERROR] Login failed:', err);
        return errorResponse(`Login error: ${err.message}`, 500, env);
      }
    }

    // POST /api/auth/verify (or GET) - Verify current session token
    if (path === '/api/auth/verify' && (method === 'POST' || method === 'GET')) {
      try {
        const authHeader = request.headers.get('Authorization') || '';
        const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
        const token = bearerMatch ? bearerMatch[1].trim() : (request.headers.get('x-api-key') || '').trim();

        if (!token) {
          return jsonResponse({ success: false, authenticated: false }, 401, env);
        }

        const verified = await verifyAuthToken(token, env);
        if (!verified.valid) {
          return jsonResponse({ success: false, authenticated: false, error: 'Session expired' }, 401, env);
        }

        return jsonResponse({
          success: true,
          authenticated: true,
          user: {
            email: verified.email,
            role: verified.role || 'admin',
            name: 'Citadel Architect'
          }
        }, 200, env);
      } catch (err: any) {
        return errorResponse(`Verify error: ${err.message}`, 500, env);
      }
    }

    // POST /api/auth/change-credentials - Update admin email & password across all devices
    if (path === '/api/auth/change-credentials' && method === 'POST') {
      try {
        const authorized = await isAuthorized(request, env);
        if (!authorized) {
          return jsonResponse({ success: false, error: 'Unauthorized: Invalid token' }, 401, env);
        }

        const body = await request.json() as any;
        const currentPassword = (body.currentPassword || '').trim();
        const newEmail = (body.newEmail || '').trim().toLowerCase();
        const newPassword = (body.newPassword || '').trim();

        if (!currentPassword || !newEmail || !newPassword) {
          return errorResponse('Current password, new email, and new password are required', 400, env);
        }

        const currentHash = await hashPassword(currentPassword);
        const adminRecord = await env.DB.prepare(
          'SELECT id, email, password_hash FROM citadel_auth WHERE password_hash = ?1 LIMIT 1;'
        ).bind(currentHash).first<{ id: string; email: string; password_hash: string }>();

        const defaultPass = env.ADMIN_PASSWORD || 'close10clients';
        if (!adminRecord && currentPassword !== defaultPass) {
          return errorResponse('Current password is incorrect', 400, env);
        }

        const newHashed = await hashPassword(newPassword);
        const now = new Date().toISOString();

        await env.DB.prepare(
          'UPDATE citadel_auth SET email = ?1, password_hash = ?2, updated_at = ?3 WHERE id = ?4;'
        ).bind(newEmail, newHashed, now, adminRecord?.id || 'primary_admin').run();

        const newToken = await generateAuthToken(newEmail, 'admin', env);

        return jsonResponse({
          success: true,
          message: 'Admin credentials updated successfully across all devices!',
          token: newToken,
          user: { email: newEmail, role: 'admin', name: 'Citadel Architect' }
        }, 200, env);
      } catch (err: any) {
        return errorResponse(`Update credentials error: ${err.message}`, 500, env);
      }
    }

    // Authenticate all remaining protected API routes
    const authorized = await isAuthorized(request, env);
    if (!authorized) {
      return jsonResponse({
        success: false,
        error: 'Unauthorized: Admin authentication token required'
      }, 401, env);
    }

    try {
      // Note: ensureTables(env) is deliberately NOT called here on every request.
      // Remote D1 database already contains citadel_sync table.
      // If manual table initialization is ever needed:
      if (path === '/api/init' && (method === 'POST' || method === 'GET')) {
        await ensureTables(env);
        return jsonResponse({ success: true, message: 'citadel_sync table verified/created.' }, 200, env);
      }

/**
 * Helper to inspect existing columns of citadel_sync in D1 to support either schema without altering the database
 */
async function getSyncColumns(env: Env): Promise<Set<string>> {
  try {
    const info = await env.DB.prepare('PRAGMA table_info(citadel_sync);').all<{ name: string }>();
    return new Set((info.results || []).map((r) => r.name.toLowerCase()));
  } catch {
    return new Set(['snapshot', 'created_at']);
  }
}

      // =========================================================================
      // Full Sync & Restore Endpoints
      // =========================================================================

      // POST /api/sync - Save full snapshot of all records into D1
      if (path === '/api/sync' && method === 'POST') {
        try {
          console.log('[SYNC] Received POST /api/sync request');
          const payload = await request.json() as any;
          if (!payload) {
            console.error('[SYNC] Failed: Missing payload');
            return errorResponse('Missing payload', 400, env);
          }

          const now = new Date().toISOString();
          const payloadWithTime = {
            ...payload,
            syncedAt: now
          };
          const jsonStr = JSON.stringify(payloadWithTime);
          console.log(`[SYNC] Upserting snapshot into citadel_sync (${(jsonStr.length / 1024).toFixed(1)} KB)`);

          const cols = await getSyncColumns(env);
          if (cols.has('snapshot')) {
            await env.DB.prepare(
              'INSERT INTO citadel_sync (id, snapshot, created_at) VALUES (1, ?1, ?2) ON CONFLICT(id) DO UPDATE SET snapshot = excluded.snapshot, created_at = excluded.created_at;'
            ).bind(jsonStr, now).run();
          } else {
            await env.DB.prepare(
              'INSERT INTO citadel_sync (id, updated_at, version, data) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at, version = excluded.version, data = excluded.data;'
            ).bind('primary', now, payload.version || '1.0.0', jsonStr).run();
          }

          console.log(`[SYNC] Success: Snapshot successfully synced at ${now}`);

          return jsonResponse({
            success: true,
            message: `Snapshot successfully synced to D1 edge database (${(jsonStr.length / 1024).toFixed(1)} KB)`,
            timestamp: now
          }, 200, env);
        } catch (syncErr: any) {
          console.error('[SYNC ERROR] /api/sync POST exception:', syncErr);
          return errorResponse(`Sync error: ${syncErr.message}`, 500, env);
        }
      }

      // POST /api/restore (or GET /api/restore / GET /api/sync) - Retrieve latest snapshot
      if ((path === '/api/restore' || path === '/api/sync') && (method === 'POST' || method === 'GET')) {
        try {
          console.log(`[RESTORE] Processing ${method} ${path}`);
          const cols = await getSyncColumns(env);
          let rawData: string | null = null;
          let updatedAt: string = new Date().toISOString();

          if (cols.has('snapshot')) {
            const row = await env.DB.prepare('SELECT snapshot, created_at FROM citadel_sync ORDER BY id DESC LIMIT 1;')
              .first<{ snapshot: string; created_at: string }>();
            if (row && row.snapshot) {
              rawData = row.snapshot;
              updatedAt = row.created_at;
            }
          } else {
            const row = await env.DB.prepare('SELECT data, updated_at, version FROM citadel_sync WHERE id = ?1 LIMIT 1;')
              .bind('primary')
              .first<{ data: string; updated_at: string; version: string }>();
            if (row && row.data) {
              rawData = row.data;
              updatedAt = row.updated_at;
            }
          }

          if (!rawData) {
            console.log('[RESTORE] Notice: No existing snapshot found in citadel_sync');
            return jsonResponse({
              success: false,
              message: 'No previous cloud snapshot found in Cloudflare D1.'
            }, 404, env);
          }

          console.log(`[RESTORE] Success: Retrieved snapshot updated at ${updatedAt}`);
          const payload = JSON.parse(rawData);
          return jsonResponse({
            success: true,
            message: `Snapshot retrieved (last updated ${updatedAt})`,
            payload,
            updated_at: updatedAt
          }, 200, env);
        } catch (restoreErr: any) {
          console.error('[RESTORE ERROR] Exception during restore/fetch:', restoreErr);
          return errorResponse(`Restore error: ${restoreErr.message}`, 500, env);
        }
      }

      // =========================================================================
      // Granular Entity Endpoints (reads from current snapshot or dedicated tables)
      // =========================================================================

      // Helper to read current snapshot bundle
      async function getSnapshotData(): Promise<any | null> {
        const cols = await getSyncColumns(env);
        if (cols.has('snapshot')) {
          const row = await env.DB.prepare('SELECT snapshot FROM citadel_sync ORDER BY id DESC LIMIT 1;')
            .first<{ snapshot: string }>();
          return row && row.snapshot ? JSON.parse(row.snapshot) : null;
        } else {
          const row = await env.DB.prepare('SELECT data FROM citadel_sync WHERE id = ?1 LIMIT 1;')
            .bind('primary')
            .first<{ data: string }>();
          return row && row.data ? JSON.parse(row.data) : null;
        }
      }

      // Helper to write updated snapshot bundle back
      async function saveSnapshotData(updated: any) {
        const now = new Date().toISOString();
        const jsonStr = JSON.stringify({ ...updated, syncedAt: now });
        const cols = await getSyncColumns(env);
        if (cols.has('snapshot')) {
          await env.DB.prepare(
            'INSERT INTO citadel_sync (id, snapshot, created_at) VALUES (1, ?1, ?2) ON CONFLICT(id) DO UPDATE SET snapshot = excluded.snapshot, created_at = excluded.created_at;'
          ).bind(jsonStr, now).run();
        } else {
          await env.DB.prepare(
            'INSERT INTO citadel_sync (id, updated_at, version, data) VALUES (\'primary\', ?1, \'1.0.0\', ?2) ON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at, data = excluded.data;'
          ).bind(now, jsonStr).run();
        }
      }

      // CLIENTS: /api/clients
      if (path === '/api/clients') {
        if (method === 'GET') {
          const snapshot = await getSnapshotData();
          return jsonResponse({ success: true, clients: snapshot?.clients || [] }, 200, env);
        }
        if (method === 'POST') {
          const newClient = await request.json() as any;
          const snapshot = (await getSnapshotData()) || { clients: [] };
          snapshot.clients = [newClient, ...(snapshot.clients || [])];
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, client: newClient }, 201, env);
        }
      }

      if (path.startsWith('/api/clients/')) {
        const clientId = decodeURIComponent(path.split('/')[3]);
        const snapshot = (await getSnapshotData()) || { clients: [] };

        if (method === 'PUT') {
          const updates = await request.json() as any;
          snapshot.clients = (snapshot.clients || []).map((c: any) => c.id === clientId ? { ...c, ...updates } : c);
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, clientId }, 200, env);
        }

        if (method === 'DELETE') {
          snapshot.clients = (snapshot.clients || []).filter((c: any) => c.id !== clientId);
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, deletedId: clientId }, 200, env);
        }
      }

      // PROJECTS: /api/projects
      if (path === '/api/projects') {
        if (method === 'GET') {
          const snapshot = await getSnapshotData();
          return jsonResponse({ success: true, projects: snapshot?.projects || [] }, 200, env);
        }
        if (method === 'POST') {
          const newProject = await request.json() as any;
          const snapshot = (await getSnapshotData()) || { projects: [] };
          snapshot.projects = [newProject, ...(snapshot.projects || [])];
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, project: newProject }, 201, env);
        }
      }

      if (path.startsWith('/api/projects/')) {
        const projectId = decodeURIComponent(path.split('/')[3]);
        const snapshot = (await getSnapshotData()) || { projects: [] };

        if (method === 'PUT') {
          const updates = await request.json() as any;
          snapshot.projects = (snapshot.projects || []).map((p: any) => p.id === projectId ? { ...p, ...updates } : p);
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, projectId }, 200, env);
        }

        if (method === 'DELETE') {
          snapshot.projects = (snapshot.projects || []).filter((p: any) => p.id !== projectId);
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, deletedId: projectId }, 200, env);
        }
      }

      // TASKS: /api/tasks
      if (path === '/api/tasks') {
        if (method === 'GET') {
          const snapshot = await getSnapshotData();
          return jsonResponse({ success: true, tasks: snapshot?.tasks || [] }, 200, env);
        }
        if (method === 'POST') {
          const newTask = await request.json() as any;
          const snapshot = (await getSnapshotData()) || { tasks: [] };
          snapshot.tasks = [newTask, ...(snapshot.tasks || [])];
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, task: newTask }, 201, env);
        }
      }

      if (path.startsWith('/api/tasks/')) {
        const taskId = decodeURIComponent(path.split('/')[3]);
        const snapshot = (await getSnapshotData()) || { tasks: [] };

        if (method === 'PUT') {
          const updates = await request.json() as any;
          snapshot.tasks = (snapshot.tasks || []).map((t: any) => t.id === taskId ? { ...t, ...updates } : t);
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, taskId }, 200, env);
        }

        if (method === 'DELETE') {
          snapshot.tasks = (snapshot.tasks || []).filter((t: any) => t.id !== taskId);
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, deletedId: taskId }, 200, env);
        }
      }

      // INVOICES: /api/invoices
      if (path === '/api/invoices') {
        if (method === 'GET') {
          const snapshot = await getSnapshotData();
          return jsonResponse({ success: true, invoices: snapshot?.invoices || [] }, 200, env);
        }
        if (method === 'POST') {
          const newInvoice = await request.json() as any;
          const snapshot = (await getSnapshotData()) || { invoices: [] };
          snapshot.invoices = [newInvoice, ...(snapshot.invoices || [])];
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, invoice: newInvoice }, 201, env);
        }
      }

      if (path.startsWith('/api/invoices/')) {
        const invoiceId = decodeURIComponent(path.split('/')[3]);
        const snapshot = (await getSnapshotData()) || { invoices: [] };

        if (method === 'PUT') {
          const updates = await request.json() as any;
          snapshot.invoices = (snapshot.invoices || []).map((i: any) => i.id === invoiceId ? { ...i, ...updates } : i);
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, invoiceId }, 200, env);
        }
      }

      // TRANSACTIONS: /api/transactions
      if (path === '/api/transactions') {
        if (method === 'GET') {
          const snapshot = await getSnapshotData();
          return jsonResponse({ success: true, transactions: snapshot?.transactions || [] }, 200, env);
        }
        if (method === 'POST') {
          const newTx = await request.json() as any;
          const snapshot = (await getSnapshotData()) || { transactions: [] };
          snapshot.transactions = [newTx, ...(snapshot.transactions || [])];
          await saveSnapshotData(snapshot);
          return jsonResponse({ success: true, transaction: newTx }, 201, env);
        }
      }

      // DOCUMENTS: /api/documents
      if (path === '/api/documents') {
        if (method === 'GET') {
          const snapshot = await getSnapshotData();
          return jsonResponse({ success: true, documents: snapshot?.documents || [] }, 200, env);
        }
      }

      // Fallback 404 for unknown endpoints
      return jsonResponse({ success: false, error: `Endpoint not found: ${method} ${path}` }, 404, env);

    } catch (err: any) {
      console.error(`[WORKER ERROR] ${method} ${path}:`, err);
      return errorResponse(`Server Error: ${err.message}`, 500, env);
    }
  }
};
