import { CloudflareD1Config, CloudflareSyncPayload } from '../types';
import { WORKER_CONFIG } from '../config/cloudflare';

/**
 * Cloudflare Worker Edge API Client
 *
 * Communicates ONLY with the secure Cloudflare Worker backend API.
 * NO Cloudflare API tokens or account credentials exist in frontend code.
 * Database transactions execute at the edge via native env.DB bindings.
 */

export function getWorkerBaseUrl(): string {
  const customUrl = WORKER_CONFIG.WORKER_URL?.trim();
  if (customUrl) {
    return customUrl.replace(/\/+$/, '');
  }
  // If running on localhost or same domain, default to relative /api or default local wrangler dev port
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://127.0.0.1:8787';
  }
  return '';
}

function getRequestHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Attach session auth token if logged in
  try {
    const token = localStorage.getItem('coc_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }
  } catch {
    // ignore
  }

  const key = WORKER_CONFIG.DASHBOARD_API_KEY?.trim();
  if (key && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${key}`;
    headers['x-api-key'] = key;
  }

  return headers;
}

export function getSavedCloudflareConfig(): CloudflareD1Config {
  let savedTimestamp: string | undefined = undefined;
  try {
    const raw = localStorage.getItem('coc_cf_last_synced');
    if (raw) savedTimestamp = raw;
  } catch {
    // ignore
  }

  return {
    accountId: '',
    databaseId: '',
    apiToken: '',
    autoSync: false,
    lastSyncedAt: savedTimestamp
  };
}

export function saveCloudflareConfig(config: CloudflareD1Config): void {
  try {
    if (config.lastSyncedAt) {
      localStorage.setItem('coc_cf_last_synced', config.lastSyncedAt);
    }
  } catch (err) {
    console.error('Failed to persist sync time:', err);
  }
}

/**
 * Test connectivity with Cloudflare Worker & D1 Database via GET /api/health
 */
export async function testCloudflareConnection(
  _config?: CloudflareD1Config
): Promise<{ success: boolean; message: string; rows?: any[] }> {
  try {
    const baseUrl = getWorkerBaseUrl();
    const endpoint = `${baseUrl}/api/health`;

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: getRequestHeaders(),
    });

    if (!res.ok) {
      let errText = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const body = await res.json();
        if (body.error) errText = body.error;
      } catch {
        // ignore
      }
      return {
        success: false,
        message: `Worker Connection Error (${errText})`
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || 'Connected to Cloudflare Worker & D1 Edge Database!',
      rows: data.d1 ? [data.d1] : []
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to Worker: ${err.message || 'Network error. Ensure Worker is deployed and running.'}`
    };
  }
}

/**
 * Push full dashboard state (active + trashed clients, projects, tasks, invoices)
 * to Cloudflare Worker via POST /api/sync
 */
export async function pushSnapshotToCloudflare(
  _config: CloudflareD1Config,
  payload: CloudflareSyncPayload
): Promise<{ success: boolean; message: string; timestamp?: string }> {
  try {
    const baseUrl = getWorkerBaseUrl();
    const endpoint = `${baseUrl}/api/sync`;
    const now = new Date().toISOString();

    const payloadWithTime: CloudflareSyncPayload = {
      ...payload,
      syncedAt: now
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify(payloadWithTime),
    });

    if (!res.ok) {
      let errText = `HTTP ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson.error) errText = errJson.error;
      } catch {
        // ignore
      }
      return {
        success: false,
        message: `Worker Sync Failed: ${errText}`
      };
    }

    const resJson = await res.json();
    return {
      success: true,
      message: resJson.message || 'Snapshot successfully backed up to D1 via Cloudflare Worker!',
      timestamp: resJson.timestamp || now
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Sync Error: ${err.message || 'Could not reach Cloudflare Worker'}`
    };
  }
}

/**
 * Pull latest snapshot from Cloudflare Worker via POST /api/restore
 */
export async function pullSnapshotFromCloudflare(
  _config: CloudflareD1Config
): Promise<{ success: boolean; message: string; payload?: CloudflareSyncPayload }> {
  try {
    const baseUrl = getWorkerBaseUrl();
    const endpoint = `${baseUrl}/api/restore`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getRequestHeaders(),
    });

    if (!res.ok) {
      let errText = `HTTP ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson.error) errText = errJson.error;
        if (errJson.message) errText = errJson.message;
      } catch {
        // ignore
      }
      return {
        success: false,
        message: errText
      };
    }

    const resJson = await res.json();
    if (!resJson.payload) {
      return {
        success: false,
        message: resJson.message || 'No snapshot data returned by Cloudflare Worker.'
      };
    }

    return {
      success: true,
      message: resJson.message || 'Snapshot successfully loaded from Cloudflare D1!',
      payload: resJson.payload
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Restore Error: ${err.message || 'Could not reach Cloudflare Worker'}`
    };
  }
}

/**
 * Authenticate Administrator credentials against Cloudflare Worker D1 Edge
 */
export async function apiLogin(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: { email: string; role: string; name: string }; error?: string }> {
  try {
    const baseUrl = getWorkerBaseUrl();
    const endpoint = `${baseUrl}/api/auth/login`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || `Login failed (${res.status})`,
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error reaching Cloudflare authentication edge.',
    };
  }
}

/**
 * Verify saved session token
 */
export async function apiVerifySession(
  token: string
): Promise<{ success: boolean; user?: { email: string; role: string; name: string }; error?: string }> {
  try {
    const baseUrl = getWorkerBaseUrl();
    const endpoint = `${baseUrl}/api/auth/verify`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Session expired',
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error validating session',
    };
  }
}

/**
 * Change administrator email and password across all devices
 */
export async function apiChangeCredentials(
  currentPassword: string,
  newEmail: string,
  newPassword: string
): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  try {
    const baseUrl = getWorkerBaseUrl();
    const endpoint = `${baseUrl}/api/auth/change-credentials`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify({ currentPassword, newEmail, newPassword }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to update credentials',
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error updating credentials',
    };
  }
}
