/**
 * Every prompt string sent to Gemini lives here, not inline in
 * geminiService.js. Keeping them in one file means a prompt can be
 * tuned, A/B'd, or reviewed for quality/safety without touching the
 * request/parsing plumbing, and every builder takes plain data and
 * returns a plain string — no SDK types leak into this file.
 */

export const TUTOR_SYSTEM_INSTRUCTION = `You are the AI Tutor inside StudyMate AI, a study companion app for students.
Explain concepts clearly and encouragingly, adapt to the student's apparent level, use short paragraphs
and concrete examples, and ask a brief follow-up question when it would help learning. Keep responses
focused — this is a chat interface, not an essay. Never fabricate facts; say when you're unsure.`;

export const STUDY_ASSISTANT_SYSTEM_INSTRUCTION = `You are the Study Assistant inside StudyMate AI. Unlike
the AI Tutor (which holds long tutoring conversations), you answer quick, standalone study questions —
"what does this term mean," "how do I approach this problem type," "give me 3 tips for memorizing this."
Be concise: 2-4 short sentences unless the question genuinely needs more. No greetings, no sign-offs.`;

export function buildFlashcardPrompt({ topic, sourceText, count }) {
  return `Generate exactly ${count} flashcards to help a student study "${topic}".
${sourceText ? `Base them on this source material:\n"""${sourceText}"""` : ""}
Each flashcard should have a concise "front" (a question or term) and a clear, correct "back"
(the answer or definition). Avoid duplicates. Return only the JSON object described by the schema.`;
}

export function buildQuizPrompt({ topic, sourceText, count, difficulty = "medium" }) {
  return `Generate exactly ${count} multiple-choice quiz questions at a ${difficulty} difficulty level
to test a student's understanding of "${topic}".
${sourceText ? `Base them on this source material:\n"""${sourceText}"""` : ""}
Each question needs exactly 4 answer options, a zero-based "correctIndex" pointing to the correct
option, and a one-sentence "explanation" of why that answer is correct. Vary the angle of each
question and avoid trivial or ambiguous ones. Return only the JSON object described by the schema.`;
}

export function buildSummarizePrompt({ content }) {
  return `Summarize the following study notes for a student reviewing them later.
Produce a short "summary" (2-4 sentences capturing the core ideas) and 3-6 "keyPoints"
(short, standalone bullet-style facts or takeaways — each one understandable on its own).
Notes:
"""${content}"""
Return only the JSON object described by the schema.`;
}

export function buildStudyAssistantAnswerPrompt({ question, context }) {
  return `${context ? `Relevant context the student provided:\n"""${context}"""\n\n` : ""}Student's question: ${question}`;
}

export function buildStudyRecommendationsPrompt({ progressSummary }) {
  return `Here is a student's current study progress data, as JSON:
"""${JSON.stringify(progressSummary)}"""

Based on this, suggest exactly 3 short, specific, actionable study recommendations for what they
should focus on next (e.g. a weak subject, a topic they haven't reviewed recently, a study habit).
Each recommendation needs a short "title" (under 8 words) and one sentence of "detail" explaining why.
Return only the JSON object described by the schema.`;
}
