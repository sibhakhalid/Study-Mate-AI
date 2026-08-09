import { Router } from "express";
import * as studyAssistantController from "../controllers/studyAssistantController.js";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { askSchema } from "../validators/studyAssistantValidators.js";

const router = Router();

router.post("/ask", aiLimiter, validate({ body: askSchema }), studyAssistantController.ask);
router.get("/recommendations", aiLimiter, studyAssistantController.getRecommendations);

export default router;
