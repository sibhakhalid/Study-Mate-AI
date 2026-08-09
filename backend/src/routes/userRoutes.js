import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import {
  updateProfileSchema,
  updatePreferencesSchema,
  updateNotificationsSchema,
} from "../validators/userValidators.js";

const router = Router();

router.get("/me", userController.getMe);
router.patch("/me", validate({ body: updateProfileSchema }), userController.updateProfile);
router.patch(
  "/me/preferences",
  validate({ body: updatePreferencesSchema }),
  userController.updatePreferences
);
router.patch(
  "/me/notifications",
  validate({ body: updateNotificationsSchema }),
  userController.updateNotifications
);
router.delete("/me", userController.deleteAccountData);

export default router;
