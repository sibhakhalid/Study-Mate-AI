import app from "../backend/src/app.js";
import { connectDB } from "../backend/src/config/db.js";
import { env } from "../backend/src/config/env.js";

function applyCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (!origin || !env.clientOrigins.includes(origin)) return;

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Vary", "Origin");
}

export default async function handler(req, res) {
  applyCorsHeaders(req, res);

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    await connectDB();
    return app(req, res);
  } catch {
    return res.status(503).json({ success: false, message: "Service temporarily unavailable" });
  }
}