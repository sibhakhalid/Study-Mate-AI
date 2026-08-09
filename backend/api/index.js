import { app } from "../src/app.js";
import { connectDB } from "../src/config/db.js";

// Vercel keeps warm function instances between requests, so the cached
// Mongoose connection is reused instead of opening a new connection per call.
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}