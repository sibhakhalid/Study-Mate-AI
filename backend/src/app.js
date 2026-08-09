import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";

import { env } from "./config/env.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import apiRoutes from "./routes/index.js";

export const app = express();

// Behind a reverse proxy (Render, Railway, Heroku, nginx) in production,
// so rate limiting and req.ip see the real client IP, not the proxy's.
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Vite's local dev ports while keeping credentials restricted to
      // configured origins in deployed environments.
      const isLocalDevOrigin =
        origin && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
      callback(null, !origin || env.clientOrigins.includes(origin) || isLocalDevOrigin);
    },
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(mongoSanitize()); // strips `$`/`.` operators from user input to block NoSQL injection

app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use(generalLimiter);

// Unauthenticated — used by uptime monitors and container orchestrators.
app.get("/health", (_req, res) => {
  new ApiResponse(200, { uptime: process.uptime() }, "OK").send(res);
});

app.use(`/api/${env.apiVersion}`, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
