import { Router } from "express";
import * as tutorChatController from "../controllers/tutorChatController.js";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import {
  sendMessageSchema,
  idParamSchema,
  listConversationsQuerySchema,
} from "../validators/tutorChatValidators.js";

const router = Router();

router
  .route("/conversations")
  .get(validate({ query: listConversationsQuerySchema }), tutorChatController.listConversations)
  .post(tutorChatController.createConversation);

router.get(
  "/conversations/:id",
  validate({ params: idParamSchema }),
  tutorChatController.getConversation
);

router.delete(
  "/conversations/:id",
  validate({ params: idParamSchema }),
  tutorChatController.deleteConversation
);

router.post(
  "/conversations/:id/messages",
  aiLimiter,
  validate({ params: idParamSchema, body: sendMessageSchema }),
  tutorChatController.sendMessage
);

export default router;
