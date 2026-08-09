import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

/**
 * Two tiers: a generous general-purpose limit for normal CRUD traffic,
 * and a much tighter one for Gemini-backed endpoints — those cost real
 * money per call and are the most attractive target for abuse.
 */
export const generalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

export const aiLimiter = rateLimit({
  windowMs: env.aiRateLimit.windowMs,
  max: env.aiRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id?.toString() || req.ip,
  message: {
    success: false,
    message: "AI request limit reached. Please wait a moment before trying again.",
  },
});
