import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import {
  TUTOR_SYSTEM_INSTRUCTION,
  STUDY_ASSISTANT_SYSTEM_INSTRUCTION,
  buildFlashcardPrompt,
  buildQuizPrompt,
  buildSummarizePrompt,
  buildStudyAssistantAnswerPrompt,
  buildStudyRecommendationsPrompt,
} from "./prompts.js";

/**
 * The ONLY module in the app that imports the Gemini SDK. Every
 * AI-backed feature (flashcard generation, quiz generation, note
 * summarization, tutor chat, study assistant) calls a function here
 * rather than touching the SDK directly — so the model, generation
 * config, and response parsing can change in one place.
 *
 * Structured outputs (flashcards, quizzes, summaries, recommendations)
 * use Gemini's JSON response mode with an explicit schema, which is far
 * more reliable than asking for JSON in a text prompt and hoping the
 * model doesn't wrap it in markdown fences or add commentary. Prompt
 * text itself lives in prompts.js, not here.
 */

const genAI = new GoogleGenerativeAI(env.gemini.apiKey);

function getModel({ responseSchema, systemInstruction } = {}) {
  return genAI.getGenerativeModel({
    model: env.gemini.model,
    systemInstruction,
    generationConfig: {
      maxOutputTokens: env.gemini.maxOutputTokens,
      temperature: 0.7,
      ...(responseSchema
        ? { responseMimeType: "application/json", responseSchema }
        : {}),
    },
  });
}

async function safeGenerate(model, prompt, context) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    logger.error(`Gemini request failed (${context})`, { error: err.message });
    throw ApiError.internal(
      "The AI service couldn't complete this request right now. Please try again shortly."
    );
  }
}

function parseJsonResponse(text, context) {
  try {
    return JSON.parse(text);
  } catch {
    logger.error(`Gemini returned unparsable JSON (${context})`, { text });
    throw ApiError.internal("The AI service returned an unexpected response. Please try again.");
  }
}

// ── Flashcard generation ──────────────────────────────────────────────

const flashcardSchema = {
  type: SchemaType.OBJECT,
  properties: {
    cards: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          front: { type: SchemaType.STRING },
          back: { type: SchemaType.STRING },
        },
        required: ["front", "back"],
      },
    },
  },
  required: ["cards"],
};

/** @returns {Promise<{front: string, back: string}[]>} */
export async function generateFlashcards({ topic, sourceText, count = 8 }) {
  const model = getModel({ responseSchema: flashcardSchema });
  const prompt = buildFlashcardPrompt({ topic, sourceText, count });

  const text = await safeGenerate(model, prompt, "generateFlashcards");
  const parsed = parseJsonResponse(text, "generateFlashcards");
  if (!Array.isArray(parsed.cards) || parsed.cards.length === 0) {
    throw ApiError.internal("The AI service didn't return any flashcards. Please try again.");
  }
  return parsed.cards;
}

// ── Quiz generation ────────────────────────────────────────────────────

const quizSchema = {
  type: SchemaType.OBJECT,
  properties: {
    questions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: { type: SchemaType.STRING },
          options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          correctIndex: { type: SchemaType.NUMBER },
          explanation: { type: SchemaType.STRING },
        },
        required: ["question", "options", "correctIndex", "explanation"],
      },
    },
  },
  required: ["questions"],
};

/** @returns {Promise<{question, options: string[4], correctIndex, explanation}[]>} */
export async function generateQuiz({ topic, sourceText, count = 5, difficulty = "medium" }) {
  const model = getModel({ responseSchema: quizSchema });
  const prompt = buildQuizPrompt({ topic, sourceText, count, difficulty });

  const text = await safeGenerate(model, prompt, "generateQuiz");
  const parsed = parseJsonResponse(text, "generateQuiz");

  const questions = parsed.questions?.filter(
    (q) => Array.isArray(q.options) && q.options.length === 4
  );
  if (!questions || questions.length === 0) {
    throw ApiError.internal("The AI service didn't return a usable quiz. Please try again.");
  }
  return questions;
}

// ── Note summarization ──────────────────────────────────────────────────

const summarySchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING },
    keyPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: ["summary", "keyPoints"],
};

/** @returns {Promise<{summary: string, keyPoints: string[]}>} */
export async function summarizeNote({ content }) {
  if (!content || !content.trim()) {
    throw ApiError.badRequest("Can't summarize an empty note.");
  }
  const model = getModel({ responseSchema: summarySchema });
  const prompt = buildSummarizePrompt({ content });

  const text = await safeGenerate(model, prompt, "summarizeNote");
  const parsed = parseJsonResponse(text, "summarizeNote");
  if (!parsed.summary || !Array.isArray(parsed.keyPoints)) {
    throw ApiError.internal("The AI service didn't return a usable summary. Please try again.");
  }
  return parsed;
}

// ── Tutor chat ──────────────────────────────────────────────────────────

/** @returns {Promise<string>} */
export async function generateTutorReply({ history = [], message }) {
  const model = getModel({ systemInstruction: TUTOR_SYSTEM_INSTRUCTION });

  // Gemini's chat API expects "model" rather than "assistant" as the role.
  const chatHistory = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (err) {
    logger.error("Gemini tutor chat failed", { error: err.message });
    throw ApiError.internal(
      "The AI Tutor couldn't respond right now. Please try again in a moment."
    );
  }
}

// ── Study Assistant ─────────────────────────────────────────────────────

/** Quick, stateless Q&A — distinct from the AI Tutor's persisted conversations. */
export async function answerStudyQuestion({ question, context }) {
  const model = getModel({ systemInstruction: STUDY_ASSISTANT_SYSTEM_INSTRUCTION });
  const prompt = buildStudyAssistantAnswerPrompt({ question, context });
  return safeGenerate(model, prompt, "answerStudyQuestion");
}

const recommendationsSchema = {
  type: SchemaType.OBJECT,
  properties: {
    recommendations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          detail: { type: SchemaType.STRING },
        },
        required: ["title", "detail"],
      },
    },
  },
  required: ["recommendations"],
};

/** @returns {Promise<{title: string, detail: string}[]>} */
export async function generateStudyRecommendations({ progressSummary }) {
  const model = getModel({ responseSchema: recommendationsSchema });
  const prompt = buildStudyRecommendationsPrompt({ progressSummary });

  const text = await safeGenerate(model, prompt, "generateStudyRecommendations");
  const parsed = parseJsonResponse(text, "generateStudyRecommendations");
  if (!Array.isArray(parsed.recommendations) || parsed.recommendations.length === 0) {
    throw ApiError.internal("The AI service didn't return recommendations. Please try again.");
  }
  return parsed.recommendations;
}
