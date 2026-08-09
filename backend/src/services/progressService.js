import { Note } from "../models/Note.js";
import { Deck, Card } from "../models/Flashcard.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { PlannerTask } from "../models/Planner.js";

/**
 * Mirrors the frontend's progressService.js design intent: Progress has
 * no data of its own, it's entirely derived from Notes/Quiz/Flashcards/
 * Planner so the numbers shown can never drift from what's actually in
 * those collections. Unlike the frontend's mock version, quiz attempts
 * here store topicId directly (see QuizAttempt.js), so subject joins
 * are a plain match — no title-to-id lookup table needed.
 */

const SUBJECT_LABELS = {
  biology: "Cell Biology",
  math: "Linear Algebra",
  history: "World History",
  cs: "Data Structures",
  general: "General",
};

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

async function computeStreak(userId) {
  const tasks = await PlannerTask.find({
    user: userId,
    type: "study",
    completed: true,
  })
    .select("date")
    .lean();

  const completedDates = new Set(tasks.map((t) => t.date));

  let current = 0;
  let cursor = new Date();
  // Today doesn't have to be completed yet for the streak to still be "alive".
  if (!completedDates.has(dateKey(cursor))) cursor = addDays(cursor, -1);
  while (completedDates.has(dateKey(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return { currentStreak: current, activeDays: completedDates.size };
}

async function computeSubjectProgress(userId) {
  const subjectIds = Object.keys(SUBJECT_LABELS).filter((id) => id !== "general");

  const [noteCounts, cardStats, quizStats] = await Promise.all([
    Note.aggregate([
      { $match: { user: userId } },
      { $unwind: { path: "$tags", preserveNullAndEmptyArrays: false } },
      { $group: { _id: { $toLower: "$tags" }, count: { $sum: 1 } } },
    ]),
    Deck.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "deck",
          as: "cards",
        },
      },
      {
        $project: {
          title: 1,
          total: { $size: "$cards" },
          known: {
            $size: {
              $filter: { input: "$cards", cond: { $eq: ["$$this.reviewState", "known"] } },
            },
          },
        },
      },
    ]),
    QuizAttempt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$topicId",
          avgScorePct: { $avg: { $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100] } },
          attempts: { $sum: 1 },
        },
      },
    ]),
  ]);

  return subjectIds.map((id) => {
    const quiz = quizStats.find((q) => q._id === id);
    return {
      subjectId: id,
      label: SUBJECT_LABELS[id],
      quizAverage: quiz ? Math.round(quiz.avgScorePct) : null,
      quizAttempts: quiz?.attempts ?? 0,
    };
  });
}

async function computeQuizPerformance(userId) {
  const attempts = await QuizAttempt.find({ user: userId })
    .sort({ completedAt: -1 })
    .limit(10)
    .select("topicTitle score totalQuestions completedAt");

  const totalAttempts = await QuizAttempt.countDocuments({ user: userId });
  const avgResult = await QuizAttempt.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        avgScorePct: { $avg: { $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100] } },
      },
    },
  ]);

  return {
    totalAttempts,
    averageScorePct: avgResult[0] ? Math.round(avgResult[0].avgScorePct) : null,
    recentAttempts: attempts,
  };
}

async function computeFlashcardMastery(userId) {
  const [totals] = await Card.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        known: { $sum: { $cond: [{ $eq: ["$reviewState", "known"] }, 1, 0] } },
        learning: { $sum: { $cond: [{ $eq: ["$reviewState", "learning"] }, 1, 0] } },
        newCards: { $sum: { $cond: [{ $eq: ["$reviewState", "new"] }, 1, 0] } },
      },
    },
  ]);

  const total = totals?.total ?? 0;
  const known = totals?.known ?? 0;
  return {
    totalCards: total,
    known,
    learning: totals?.learning ?? 0,
    new: totals?.newCards ?? 0,
    masteryPct: total > 0 ? Math.round((known / total) * 100) : 0,
  };
}

async function computeStudyTimeSeries(userId, days = 7) {
  const since = dateKey(addDays(new Date(), -(days - 1)));
  const tasks = await PlannerTask.find({
    user: userId,
    type: "study",
    completed: true,
    date: { $gte: since },
  })
    .select("date durationMinutes")
    .lean();

  const byDate = new Map();
  for (let i = 0; i < days; i++) {
    byDate.set(dateKey(addDays(new Date(), -(days - 1 - i))), 0);
  }
  for (const task of tasks) {
    byDate.set(task.date, (byDate.get(task.date) || 0) + (task.durationMinutes || 0));
  }

  return Array.from(byDate.entries()).map(([date, minutes]) => ({ date, minutes }));
}

async function computeAchievements(userId) {
  const [noteCount, deckCount, quizCount, streak] = await Promise.all([
    Note.countDocuments({ user: userId }),
    Deck.countDocuments({ user: userId }),
    QuizAttempt.countDocuments({ user: userId }),
    computeStreak(userId),
  ]);

  return [
    { id: "first-note", label: "First Note", unlocked: noteCount >= 1 },
    { id: "note-taker", label: "Note Taker (10 notes)", unlocked: noteCount >= 10 },
    { id: "first-deck", label: "First Flashcard Deck", unlocked: deckCount >= 1 },
    { id: "first-quiz", label: "First Quiz Completed", unlocked: quizCount >= 1 },
    { id: "quiz-regular", label: "Quiz Regular (10 attempts)", unlocked: quizCount >= 10 },
    { id: "streak-3", label: "3-Day Streak", unlocked: streak.currentStreak >= 3 },
    { id: "streak-7", label: "7-Day Streak", unlocked: streak.currentStreak >= 7 },
  ];
}

export async function getProgressSummary(userId) {
  const [streak, subjects, quizPerformance, flashcardMastery, studyTimeSeries, achievements] =
    await Promise.all([
      computeStreak(userId),
      computeSubjectProgress(userId),
      computeQuizPerformance(userId),
      computeFlashcardMastery(userId),
      computeStudyTimeSeries(userId),
      computeAchievements(userId),
    ]);

  return { streak, subjects, quizPerformance, flashcardMastery, studyTimeSeries, achievements };
}
