/**
 * =====================================================================
 *  CLOUDFLARE WORKER EDGE API CONFIGURATION
 * =====================================================================
 * The React frontend connects ONLY to your Cloudflare Worker backend.
 * NO Cloudflare API tokens or account credentials exist in this client code.
 *
 * All database operations are handled securely on Cloudflare's edge
 * using native D1 bindings (env.DB).
 * =====================================================================
 */

export const WORKER_CONFIG = {
  // Your deployed Cloudflare Worker URL (e.g. "https://citadel-edge-api.<subdomain>.workers.dev")
  // Or "http://127.0.0.1:8787" during local worker dev
  // If left empty, defaults to current origin or relative "/api"
  WORKER_URL: (import.meta.env.VITE_WORKER_URL as string) || 'https://citadel-edge-api.bhavsarprathmesh71.workers.dev',

  // Optional dashboard access key (matches DASHBOARD_API_KEY worker secret)
  DASHBOARD_API_KEY: (import.meta.env.VITE_DASHBOARD_API_KEY as string) || '',
};
