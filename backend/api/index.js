const PRODUCTION_CLIENT_ORIGIN = "https://study-mate-ai-b41e.vercel.app";

function getAllowedOrigins() {
  return [
    PRODUCTION_CLIENT_ORIGIN,
    ...(process.env.CLIENT_ORIGIN || process.env.FRONTEND_URL || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ];
}

function applyCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (!origin || !getAllowedOrigins().includes(origin)) return;

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Vary", "Origin");
}

// Vercel keeps warm function instances between requests, so the cached
// Mongoose connection is reused instead of opening a new connection per call.
export default async function handler(req, res) {
  applyCorsHeaders(req, res);

  // Preflight must not wait for MongoDB. Browsers need this response before
  // they will send credentialed API requests to the serverless function.
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const [{ app }, { connectDB }] = await Promise.all([
      import("../src/app.js"),
      import("../src/config/db.js"),
    ]);
    await connectDB();
    return app(req, res);
  } catch {
    return res.status(503).json({ success: false, message: "Service temporarily unavailable" });
  }
}