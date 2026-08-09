import "dotenv/config";

/**
 * Centralized, validated environment access. Every other module imports
 * `env` from here instead of touching `process.env` directly — so a
 * missing/misnamed variable fails loudly at boot, not with a cryptic
 * runtime error three requests later.
 */

const REQUIRED_VARS = [
  "MONGODB_URI",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "GEMINI_API_KEY",
];

// Values straight from .env.example — present but never actually filled
// in. A plain emptiness check misses these (they're non-empty strings),
// which would let the server boot "successfully" and then fail deep
// inside a request — Firebase Admin rejecting every token, Gemini
// rejecting every call — instead of refusing to start with a clear
// message pointing at the actual problem.
const PLACEHOLDER_VALUES = new Set([
  "mongodb+srv://<user>:<password>@<cluster>.mongodb.net/studymate?retryWrites=true&w=majority",
  "your-firebase-project-id",
  "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "-----BEGIN PRIVATE KEY-----\\nYOUR_KEY_HERE\\n-----END PRIVATE KEY-----\\n",
  "your-gemini-api-key",
]);

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(
      `Missing required environment variable: ${name}. Check .env against .env.example.`
    );
  }
  if (PLACEHOLDER_VALUES.has(value.trim())) {
    throw new Error(
      `${name} is still set to its .env.example placeholder value. ` +
        `Replace it with your real credential in .env before starting the server.`
    );
  }
  return value;
}

// Fail fast on boot rather than surfacing a confusing error mid-request.
for (const key of REQUIRED_VARS) {
  requireEnv(key);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 5000,
  apiVersion: process.env.API_VERSION || "v1",

  clientOrigins: (process.env.CLIENT_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  mongodbUri: process.env.MONGODB_URI,

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Env files can't hold real newlines, so the key is stored with
    // literal "\n" sequences and unescaped here.
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    maxOutputTokens: Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) || 2048,
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 300,
  },
  aiRateLimit: {
    windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60 * 1000,
    max: Number(process.env.AI_RATE_LIMIT_MAX) || 15,
  },
};
