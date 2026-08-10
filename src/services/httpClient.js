import { auth } from "../config/firebase";

/**
 * Central place every feature's service.js imports from. Knows about
 * the Express API base URL, attaches the current Firebase ID token to
 * every request, and unwraps the backend's { success, data, message }
 * envelope so feature services get plain data back — same shape their
 * mock implementations already returned.
 */

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const isLocalhostUrl = configuredBaseUrl && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(configuredBaseUrl);

function normalizeBaseUrl(value) {
  if (!value) return value;

  const normalized = value.replace(/\/+$/, "");
  const hasApiVersion = /\/api\/v1$/i.test(normalized);
  return hasApiVersion ? normalized : `${normalized}/api/v1`;
}

// A localhost value must never escape into a production bundle. The relative
// fallback keeps the single-domain Vercel deployment working when its env var
// is missing, while Vercel's VITE_API_BASE_URL can still point at a separate
// deployed API when needed.
export const API_BASE_URL =
  import.meta.env.PROD && isLocalhostUrl
    ? "/api/v1"
    : normalizeBaseUrl(configuredBaseUrl) || (import.meta.env.PROD ? "/api/v1" : null);
export const isBackendConfigured = Boolean(API_BASE_URL);

async function getAuthHeaders(forceRefresh = false) {
  // auth is null when Firebase env vars aren't configured (see
  // config/firebase.js) — requests still go out without a token rather
  // than crashing, and the backend will correctly reject them as
  // unauthorized, which is a much clearer failure than a thrown error
  // deep in a fetch call.
  if (auth?.authStateReady) await auth.authStateReady();
  const user = auth?.currentUser;
  if (!user) return {};
  // getIdToken() returns the cached token and transparently refreshes
  // it under the hood if it's within 5 minutes of expiring — callers
  // never need to think about token refresh themselves.
  const token = await user.getIdToken(forceRefresh);
  return { Authorization: `Bearer ${token}` };
}

async function sendRequest(path, options, authHeaders) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });
}

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      `No backend configured yet. Attempted request to "${path}". ` +
        `Feature services should fall back to local/mock data until VITE_API_BASE_URL is set.`
    );
  }

  const authHeaders = await getAuthHeaders();
  let res = await sendRequest(path, options, authHeaders);

  // A token can expire between Firebase's cache check and the request.
  // Refresh once on 401 so a valid session is not treated as logged out.
  if (res.status === 401 && auth?.currentUser) {
    res = await sendRequest(path, options, await getAuthHeaders(true));
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // No JSON body (e.g. a 204) — fall through with body left null.
  }

  if (!res.ok) {
    throw new Error(body?.message || `Request to ${path} failed: ${res.status}`);
  }

  return body?.data !== undefined ? body.data : body;
}
