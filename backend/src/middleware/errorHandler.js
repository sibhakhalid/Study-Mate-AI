import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

/**
 * Single place every error in the app funnels through. Operational
 * errors (ApiError instances) are trusted and returned as-is; anything
 * else (a bug, a driver exception) is logged with its stack and
 * returned as a generic 500 so internals never leak to clients.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let statusCode = 500;
  let message = "Internal server error";
  let details = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === "ValidationError") {
    // Mongoose schema validation error
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => e.message);
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
    details = err.keyValue;
  }

  const isServerError = statusCode >= 500;
  logger[isServerError ? "error" : "warn"](`${req.method} ${req.originalUrl} -> ${statusCode}`, {
    message: err.message,
    ...(isServerError && !env.isProduction ? { stack: err.stack } : {}),
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
}

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
