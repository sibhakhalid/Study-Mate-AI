import { Note } from "../models/Note.js";
import { answerStudyQuestion, generateStudyRecommendations } from "./geminiService.js";
import { getProgressSummary } from "./progressService.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Distinct from the AI Tutor: no persisted conversation, no history —
 * just "ask a quick thing, get a quick answer." Useful for embedding a
 * lightweight help affordance anywhere in the app (a note, a flashcard,
 * the dashboard) without the overhead of managing a chat thread.
 */
export async function ask(userId, { question, noteId }) {
  let context;
  if (noteId) {
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) throw ApiError.notFound("Note not found");
    context = note.content;
  }

  const answer = await answerStudyQuestion({ question, context });
  return { question, answer };
}

/** Personalized "what should I study next" suggestions, grounded in real progress data. */
export async function getRecommendations(userId) {
  const progressSummary = await getProgressSummary(userId);
  const recommendations = await generateStudyRecommendations({ progressSummary });
  return { recommendations, generatedAt: new Date() };
}
