// Generates a `.env` file from environment variables before the Vite build.
//
// Vite only reads `VITE_*` variables from `.env` files at build time — it does
// not have access to the process environment the way a Node server would.
// Railway (and other hosts) provide these values as regular environment
// variables, so we write them into `.env` here before invoking `vite build`.

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const requiredVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
];

const optionalVars = [
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.warn(
    `[generate-env] Warning: missing environment variables: ${missing.join(", ")}. ` +
      "The build will continue, but Firebase may not be configured correctly.",
  );
}

const lines = [...requiredVars, ...optionalVars]
  .filter((key) => process.env[key] !== undefined)
  .map((key) => `${key}=${process.env[key]}`);

const envPath = resolve(process.cwd(), ".env");
writeFileSync(envPath, lines.join("\n") + "\n", "utf-8");

console.log(`[generate-env] Wrote ${lines.length} variable(s) to ${envPath}`);
