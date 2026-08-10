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
export default app;

// Behind a reverse proxy (Render, Railway, Heroku, nginx) in production,
// so rate limiting and req.ip see the real client IP, not the proxy's.
app.set("trust proxy", 1);

app.use(helmet());
const corsOptions = {
  origin: (origin, callback) => {
    // Requests without an Origin header include health checks and server-to-server calls.
    if (!origin || env.clientOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS before every route and error handler so headers are present on
// successful responses, handled errors, and explicit preflight requests.
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
