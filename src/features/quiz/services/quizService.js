import { mockQuestionBank } from "../data/mockQuestionBank";
import { apiRequest, isBackendConfigured } from "../../../services/httpClient";
import { normalizeDoc, normalizeDocs } from "../../../utils/normalizeMongoDoc";

/**
 * Two implementations behind one interface — see notesService.js for
 * the full rationale. Backend mode calls the real Gemini-backed
 * /quiz/generate endpoint and persists graded attempts server-side;
 * mock mode keeps the original local question bank so the app stays
 * demoable without a backend running.
 *
 * To test the error state in the UI (mock mode only): select
 * "Force error (testing)" as the topic in the config panel.
 */

const USE_BACKEND = isBackendConfigured;

const STORAGE_KEY = "studymate.quizAttempts";
const GENERATION_LATENCY = 1300;

function readAttempts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAttempts(attempts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeId(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// The UI reads attempt.total (not .totalQuestions) — this alias keeps
// components unchanged regardless of which backend an attempt came from.
function normalizeAttempt(attempt) {
  const doc = normalizeDoc(attempt);
  return { ...doc, total: doc.totalQuestions ?? doc.total };
}

export async function generateQuiz({ topicId, topicTitle, numQuestions = 5, difficulty = "medium", sourceNoteId }) {
  if (USE_BACKEND) {
    const result = await apiRequest("/quiz/generate", {
      method: "POST",
      // The config UI shows "Easy" / "Medium" / "Hard" (see mockTopics'
      // difficultyOptions), but the backend's validator only accepts
      // lowercase ("easy" | "medium" | "hard") — without this, every
      // real quiz generation request failed validation with a 400.
      body: JSON.stringify({
        topicId,
        topicTitle,
        count: numQuestions,
        difficulty: difficulty.toLowerCase(),
        sourceNoteId,
      }),
    });
    return {
      ...result,
      questions: result.questions.map((q) => ({ id: makeId("q"), ...q })),
    };
  }

  await delay(GENERATION_LATENCY);

  if (topicId === "force-error") {
    throw new Error("Couldn't generate a quiz right now. Please try again.");
  }

  const bank = mockQuestionBank[topicId] ?? [];
  if (bank.length === 0) {
    throw new Error("No questions available for this topic yet.");
  }

  // Cycle through the bank if more questions are requested than exist —
  // keeps the mock usable at any numQuestions without special-casing.
  const questions = Array.from({ length: numQuestions }, (_, i) => ({
    id: makeId("q"),
    ...bank[i % bank.length],
  }));

  return { topicId, topicTitle, questions };
}

export async function getAttempts() {
  if (USE_BACKEND) {
    // See notesService.getNotes for why an explicit limit matters —
    // same truncation risk applies to attempt history.
    const attempts = await apiRequest("/quiz/attempts?limit=100");
    return normalizeDocs(attempts).map(normalizeAttempt);
  }

  await delay(300);
  return readAttempts().sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

/**
 * In backend mode, grading happens server-side from the full question
 * set (each question's correctIndex + the student's selectedIndex) —
 * the server is the source of truth for scoring, not a number the
 * client hands over. `questions` must include `selectedIndex` on each
 * item; QuizPage builds that from its answer state before calling this.
 */
export async function saveAttempt({ topicId, topicTitle, questions, score, total, timeTakenSeconds }) {
  if (USE_BACKEND) {
    const attempt = await apiRequest("/quiz/attempts", {
      method: "POST",
      body: JSON.stringify({ topicId, topicTitle, questions, timeTakenSeconds }),
    });
    return normalizeAttempt(attempt);
  }

  await delay(200);
  const attempt = {
    id: makeId("a"),
    topicTitle,
    score,
    total,
    timeTakenSeconds,
    completedAt: new Date().toISOString(),
  };
  const attempts = readAttempts();
  writeAttempts([attempt, ...attempts]);
  return attempt;
}
