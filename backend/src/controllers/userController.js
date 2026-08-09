import * as userService from "../services/userService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** req.user is already the resolved Mongo document, courtesy of attachUser middleware. */

export const getMe = asyncHandler(async (req, res) => {
  new ApiResponse(200, req.user).send(res);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user, req.body);
  new ApiResponse(200, user, "Profile updated").send(res);
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const preferences = await userService.updatePreferences(req.user, req.body);
  new ApiResponse(200, preferences, "Preferences updated").send(res);
});

export const updateNotifications = asyncHandler(async (req, res) => {
  const notifications = await userService.updateNotifications(req.user, req.body);
  new ApiResponse(200, notifications, "Notification settings updated").send(res);
});

/** Firebase account deletion itself is handled client-side via the Firebase
 * SDK — this only cleans up the app data that belongs to this user. */
export const deleteAccountData = asyncHandler(async (req, res) => {
  await userService.deleteAllUserData(req.user._id);
  new ApiResponse(200, null, "Account data deleted").send(res);
});
