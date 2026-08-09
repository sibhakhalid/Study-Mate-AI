import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

mongoose.set("strictQuery", true);

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;
let connectionPromise;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Connects to MongoDB with a bounded retry/backoff loop — useful when
 * the DB and API start up as separate containers/services and the API
 * wins the race. Exits the process if it never succeeds, since serving
 * requests without a DB would just fail every request anyway.
 */
export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (connectionPromise) return connectionPromise;

  connectionPromise = connectWithRetry();
  try {
    await connectionPromise;
  } finally {
    connectionPromise = null;
  }
}

async function connectWithRetry() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(env.mongodbUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      });
      logger.info("MongoDB connected", { host: mongoose.connection.host });
      return;
    } catch (err) {
      logger.warn(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed`, {
        error: err.message,
      });
      if (attempt === MAX_RETRIES) {
        const connectionError = new Error("MongoDB connection failed permanently.");
        logger.error(connectionError.message);
        throw connectionError;
      }
      await sleep(RETRY_DELAY_MS);
    }
  }
}

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error", { error: err.message });
});
