import { Router } from "express";
import * as flashcardsController from "../controllers/flashcardsController.js";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import {
  createDeckSchema,
  generateDeckSchema,
  reviewCardSchema,
  idParamSchema,
  listDecksQuerySchema,
} from "../validators/flashcardValidators.js";

const router = Router();

router
  .route("/decks")
  .get(validate({ query: listDecksQuerySchema }), flashcardsController.listDecks)
  .post(validate({ body: createDeckSchema }), flashcardsController.createDeck);

router.post(
  "/decks/generate",
  aiLimiter,
  validate({ body: generateDeckSchema }),
  flashcardsController.generateDeck
);

router
  .route("/decks/:id")
  .get(validate({ params: idParamSchema }), flashcardsController.getDeck)
  .delete(validate({ params: idParamSchema }), flashcardsController.deleteDeck);

router.get(
  "/decks/:id/cards",
  validate({ params: idParamSchema }),
  flashcardsController.listDeckCards
);

router.patch(
  "/cards/:id/review",
  validate({ params: idParamSchema, body: reviewCardSchema }),
  flashcardsController.reviewCard
);

export default router;
