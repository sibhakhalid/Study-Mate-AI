import { firebaseAuth } from "../config/firebaseAdmin.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Verifies the Firebase ID token sent as `Authorization: Bearer <token>`.
 * On success, attaches the decoded token (uid, email, name, picture) to
 * req.firebaseUser. Does NOT touch MongoDB — see attachUser.js for the
 * step that resolves this into our own User document.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw ApiError.unauthorized("Missing or malformed Authorization header");
  }

  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    req.firebaseUser = decoded;
    next();
  } catch (err) {
    throw ApiError.unauthorized(`Invalid or expired token: ${err.message}`);
  }
});
