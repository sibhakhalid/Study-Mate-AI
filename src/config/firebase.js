import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Single place the app initializes Firebase. Every value comes from
 * .env (see .env.example) — never hardcoded, so dev/staging/prod can
 * point at different Firebase projects without touching source.
 *
 * `getApps().length` guard avoids "Firebase App already exists" errors
 * under Vite's hot module reload.
 *
 * IMPORTANT: this module deliberately does NOT throw when config is
 * missing. It's imported at the very top of the app's module graph (via
 * AuthProvider, which wraps everything including the public landing
 * page), so throwing here would blank-screen the entire app — including
 * pages that need no auth at all — the moment someone runs the app
 * before creating .env. Instead, `auth` is exported as null and
 * `firebaseConfigError` carries a human-readable explanation; callers
 * (AuthContext, and ultimately the login/signup forms) surface that
 * message in context instead of crashing.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const REQUIRED_KEYS = ["apiKey", "authDomain", "projectId", "appId"];

// Values straight from .env.example — if these are still present, the
// person copied the template but never replaced them with a real
// project's credentials. Checking for emptiness alone isn't enough:
// "your-firebase-api-key" is a non-empty string, so a naive falsy
// check would think Firebase IS configured and hand these straight to
// initializeApp(), which fails with confusing SDK-level errors
// (invalid-api-key, network errors reaching a nonexistent project)
// instead of a clear "you haven't set this up yet" message.
const PLACEHOLDER_VALUES = new Set([
  "your-firebase-api-key",
  "your-project.firebaseapp.com",
  "your-firebase-project-id",
  "your-project.appspot.com",
  "your-messaging-sender-id",
  "your-firebase-app-id",
]);

const missingKeys = REQUIRED_KEYS.filter(
  (key) => !firebaseConfig[key] || PLACEHOLDER_VALUES.has(firebaseConfig[key])
);

const ENV_VAR_NAMES = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  appId: "VITE_FIREBASE_APP_ID",
};

export const firebaseConfigError =
  missingKeys.length > 0
    ? `Firebase isn't configured yet. Missing: ${missingKeys.map((k) => ENV_VAR_NAMES[k]).join(", ")}. ` +
      `Copy .env.example to .env and fill in your Firebase project's values.`
    : null;

if (firebaseConfigError) {
  // Loud in the console for whoever's running this locally, but never
  // thrown — see the module comment above for why.
  console.error(`[Firebase] ${firebaseConfigError}`);
}

export const firebaseApp = firebaseConfigError
  ? null
  : (getApps()[0] ?? initializeApp(firebaseConfig));

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
