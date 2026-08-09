import { findOrCreateUser } from "../services/userService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Just-in-time user provisioning: the first authenticated request from
 * a given Firebase account creates its User document automatically, so
 * there's no separate "register in our DB" step the frontend has to
 * remember to call after Firebase sign-up. Every route after this one
 * can trust req.user is a full Mongoose document.
 */
export const attachUser = asyncHandler(async (req, _res, next) => {
  req.user = await findOrCreateUser(req.firebaseUser);
  next();
});
