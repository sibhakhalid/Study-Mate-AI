import { Router } from "express";
import * as quizController from "../controllers/quizController.js";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import { generateQuizSchema, submitAttemptSchema, listAttemptsQuerySchema } from "../validators/quizValidators.js";
import { idParamSchema } from "../validators/noteValidators.js";

const router = Router();

router.get("/topics", quizController.listTopics);

router.post(
  "/generate",
  aiLimiter,
  validate({ body: generateQuizSchema }),
  quizController.generateQuizHandler
);

router
  .route("/attempts")
  .get(validate({ query: listAttemptsQuerySchema }), quizController.listAttempts)
  .post(validate({ body: submitAttemptSchema }), quizController.submitAttempt);

router.get(
  "/attempts/:id",
  validate({ params: idParamSchema }),
  quizController.getAttemptById
);

export default router;
