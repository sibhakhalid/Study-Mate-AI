import { Router } from "express";
import * as notesController from "../controllers/notesController.js";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import {
  createNoteSchema,
  updateNoteSchema,
  listNotesQuerySchema,
  idParamSchema,
} from "../validators/noteValidators.js";

const router = Router();

router
  .route("/")
  .get(validate({ query: listNotesQuerySchema }), notesController.listNotes)
  .post(validate({ body: createNoteSchema }), notesController.createNote);

router
  .route("/:id")
  .get(validate({ params: idParamSchema }), notesController.getNoteById)
  .patch(validate({ params: idParamSchema, body: updateNoteSchema }), notesController.updateNote)
  .delete(validate({ params: idParamSchema }), notesController.deleteNote);

router.patch(
  "/:id/favorite",
  validate({ params: idParamSchema }),
  notesController.toggleFavorite
);

router.post(
  "/:id/summarize",
  aiLimiter,
  validate({ params: idParamSchema }),
  notesController.summarizeNote
);

export default router;
