import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { attachUser } from "../middleware/attachUser.js";

import userRoutes from "./userRoutes.js";
import notesRoutes from "./notesRoutes.js";
import flashcardsRoutes from "./flashcardsRoutes.js";
import quizRoutes from "./quizRoutes.js";
import plannerRoutes from "./plannerRoutes.js";
import progressRoutes from "./progressRoutes.js";
import tutorChatRoutes from "./tutorChatRoutes.js";
import studyAssistantRoutes from "./studyAssistantRoutes.js";

const router = Router();

/**
 * Every route below this line requires a valid Firebase ID token and a
 * resolved Mongo user (req.user). Applying both middlewares once here,
 * rather than per-route, means a new feature router is automatically
 * protected just by being mounted below this point — there's no way to
 * accidentally ship an unauthenticated data route.
 */
router.use(requireAuth, attachUser);

router.use("/users", userRoutes);
router.use("/notes", notesRoutes);
router.use("/flashcards", flashcardsRoutes);
router.use("/quiz", quizRoutes);
router.use("/planner", plannerRoutes);
router.use("/progress", progressRoutes);
router.use("/tutor-chat", tutorChatRoutes);
router.use("/study-assistant", studyAssistantRoutes);

export default router;
