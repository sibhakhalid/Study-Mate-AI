import { QuizAttempt } from "../models/QuizAttempt.js";
import { Note } from "../models/Note.js";
import { generateQuiz as generateQuizFromGemini } from "./geminiService.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, paginateQuery } from "../utils/pagination.js";

/**
 * Static topic list mirrors the frontend's subjects vocabulary
 * (Notes/Quiz/Flashcards/Planner all share these subject ids). A
 * "custom" option lets the student type any topic and still hit the
 * same generate function.
 */
const TOPICS = [
  { id: "biology", title: "Cell Biology", description: "Mitochondria, membranes, and cell structure" },
  { id: "math", title: "Linear Algebra", description: "Eigenvectors, matrices, and transformations" },
  { id: "history", title: "World History — WWI", description: "Causes, alliances, and key events" },
  { id: "cs", title: "Data Structures", description: "Big O notation and algorithm complexity" },
];

export function listTopics() {
  return TOPICS;
}

/** Generates a fresh quiz via Gemini. Not persisted until the student submits an attempt. */
export async function generateQuiz(userId, { topicId, topicTitle, sourceNoteId, count, difficulty }) {
  let sourceText;
  if (sourceNoteId) {
    const note = await Note.findOne({ _id: sourceNoteId, user: userId });
    if (!note) throw ApiError.notFound("Source note not found");
    sourceText = note.content;
  }

  const questions = await generateQuizFromGemini({ topic: topicTitle, sourceText, count, difficulty });
  return { topicId, topicTitle, questions };
}

/** Grades and persists a completed attempt from the answers the student selected. */
export async function submitAttempt(userId, { topicId, topicTitle, questions, timeTakenSeconds }) {
  const score = questions.filter((q) => q.selectedIndex === q.correctIndex).length;

  return QuizAttempt.create({
    user: userId,
    topicId,
    topicTitle,
    questions,
    score,
    totalQuestions: questions.length,
    timeTakenSeconds: timeTakenSeconds ?? null,
    completedAt: new Date(),
  });
}

export async function listAttempts(userId, query) {
  const pagination = parsePagination(query);
  return paginateQuery(
    QuizAttempt,
    { user: userId },
    pagination,
    { sort: { completedAt: -1 }, select: "-questions.explanation" }
  );
}

export async function getAttemptById(userId, attemptId) {
  const attempt = await QuizAttempt.findOne({ _id: attemptId, user: userId });
  if (!attempt) throw ApiError.notFound("Attempt not found");
  return attempt;
}
