import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";

async function start() {
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`StudyMate AI API listening on port ${env.port}`, {
      env: env.nodeEnv,
      apiVersion: env.apiVersion,
    });
  });

  // Fail loudly instead of leaving the process in a half-broken state.
  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", { reason: reason?.message || reason });
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception", { error: err.message, stack: err.stack });
    process.exit(1);
  });

  for (const signal of ["SIGTERM", "SIGINT"]) {
    process.on(signal, () => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });
  }
}

start();
