import mongoose from "mongoose";

/**
 * Each attempt stores a full snapshot of the questions it was graded
 * against (not just a reference to a shared quiz doc). Quizzes are
 * AI-generated fresh each time, so there's no stable "Quiz" entity to
 * point back to — and snapshotting means AnswerReviewList can always
 * show exactly what the student saw, even if they never take that
 * combination of questions again.
 *
 * Stores `topicId` (not just a display title) specifically so Progress
 * can join attempts to subjects directly — the frontend's mock-data
 * version had to reverse-map titles to IDs as a workaround; this schema
 * removes the need for that.
 */
const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topicId: { type: String, required: true },
    topicTitle: { type: String, required: true },
    questions: [
      {
        _id: false,
        question: { type: String, required: true },
        options: {
          type: [String],
          validate: (arr) => arr.length === 4,
        },
        correctIndex: { type: Number, required: true, min: 0, max: 3 },
        explanation: { type: String, default: "" },
        selectedIndex: { type: Number, default: null, min: -1, max: 3 },
      },
    ],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: null, min: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
quizAttemptSchema.index({ user: 1, completedAt: -1 });

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
