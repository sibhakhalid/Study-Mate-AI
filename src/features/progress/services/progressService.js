import * as quizService from "../../quiz/services/quizService";
import * as flashcardService from "../../flashcards/services/flashcardService";
import * as plannerService from "../../planner/services/plannerService";
import * as notesService from "../../notes/services/notesService";
import { dateKey, addDays } from "../../../utils/dateHelpers";

/**
 * Aggregates real data already persisted by other features — not a
 * separate invented mock dataset, which would show numbers that
 * contradict what's actually in Notes/Quiz/Flashcards/Planner. This is
 * also why Progress needed zero backend wiring of its own: once those
 * four services talk to the real API (they all do now), this
 * composition automatically reflects real authenticated data.
 *
 * QUIZ_TITLE_TO_SUBJECT_ID is a fallback only, for attempts saved by
 * the mock quiz service (which never stored topicId). Real backend
 * attempts carry topicId directly — see QuizAttempt.js — so subject
 * matching prefers that and only falls back to the title lookup when
 * it's missing.
 */
const QUIZ_TITLE_TO_SUBJECT_ID = {
  "Cell Biology": "biology",
  "Linear Algebra": "math",
  "World History — WWI": "history",
  "Data Structures": "cs",
};

const SUBJECT_LABELS = {
  biology: "Cell Biology",
  math: "Linear Algebra",
  history: "World History",
  cs: "Data Structures",
};

function isCompletedStudyTask(task) {
  return task.type === "study" && task.completed;
}

function inRange(dateStr, start, end) {
  return dateStr >= start && dateStr <= end;
}

export async function getStudyStreak() {
  const tasks = await plannerService.getTasks();
  const completedDates = new Set(
    tasks.filter((t) => t.completed).map((t) => t.date)
  );

  let streak = 0;
  let cursor = new Date();
  // If nothing was completed today yet, the streak still counts from
  // yesterday backward — don't zero out someone's streak at 8am.
  if (!completedDates.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }
  while (completedDates.has(dateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export async function getPeriodStats(period = "week") {
  const tasks = await plannerService.getTasks();
  const today = new Date();
  const todayKey = dateKey(today);
  const startKey =
    period === "today"
      ? todayKey
      : period === "week"
        ? dateKey(addDays(today, -6))
        : dateKey(addDays(today, -29));

  const inPeriod = tasks.filter((t) => inRange(t.date, startKey, todayKey));
  const studyMinutes = inPeriod
    .filter(isCompletedStudyTask)
    .reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
  const tasksCompleted = inPeriod.filter((t) => t.completed).length;

  return { studyMinutes, tasksCompleted };
}

export async function getStudyTimeSeries(days = 14) {
  const tasks = await plannerService.getTasks();
  const today = new Date();

  return Array.from({ length: days }, (_, i) => {
    const date = addDays(today, -(days - 1) + i);
    const key = dateKey(date);
    const minutes = tasks
      .filter((t) => t.date === key && isCompletedStudyTask(t))
      .reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
    return {
      date: key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      minutes,
    };
  });
}

export async function getSubjectProgress() {
  const [decks, attempts, tasks] = await Promise.all([
    flashcardService.getDecks(),
    quizService.getAttempts(),
    plannerService.getTasks(),
  ]);

  return Object.keys(SUBJECT_LABELS).map((subjectId) => {
    const deck = decks.find((d) => d.id === subjectId);
    const subjectAttempts = attempts.filter(
      (a) => (a.topicId ?? QUIZ_TITLE_TO_SUBJECT_ID[a.topicTitle]) === subjectId
    );
    const quizAvg =
      subjectAttempts.length > 0
        ? Math.round(
            subjectAttempts.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) /
              subjectAttempts.length
          )
        : null;
    const completedTasks = tasks.filter(
      (t) => t.subjectId === subjectId && t.completed
    ).length;

    const signals = [deck?.masteryPercent, quizAvg].filter((v) => v !== null && v !== undefined);
    const overallPercent =
      signals.length > 0 ? Math.round(signals.reduce((a, b) => a + b, 0) / signals.length) : 0;

    return {
      subjectId,
      title: SUBJECT_LABELS[subjectId],
      flashcardMastery: deck?.masteryPercent ?? null,
      quizAvg,
      completedTasks,
      overallPercent,
    };
  });
}

export async function getQuizPerformance() {
  const attempts = await quizService.getAttempts();
  if (attempts.length === 0) {
    return { totalAttempts: 0, averageScore: null, recentAttempts: [] };
  }
  const averageScore = Math.round(
    attempts.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) / attempts.length
  );
  return {
    totalAttempts: attempts.length,
    averageScore,
    recentAttempts: attempts.slice(0, 5),
  };
}

export async function getFlashcardMastery() {
  const decks = await flashcardService.getDecks();
  return decks
    .filter((d) => d.id !== "force-error")
    .map((d) => ({ id: d.id, title: d.title, masteryPercent: d.masteryPercent, cardCount: d.cardCount }));
}

export async function getAchievements() {
  const [streak, attempts, decks, tasks, notes] = await Promise.all([
    getStudyStreak(),
    quizService.getAttempts(),
    flashcardService.getDecks(),
    plannerService.getTasks(),
    notesService.getNotes(),
  ]);

  const tasksCompleted = tasks.filter((t) => t.completed).length;
  const bestQuizScore = attempts.length
    ? Math.max(...attempts.map((a) => (a.score / a.total) * 100))
    : 0;
  const bestDeckMastery = decks.length
    ? Math.max(...decks.map((d) => d.masteryPercent ?? 0))
    : 0;

  return [
    {
      id: "first-steps",
      title: "First Steps",
      description: "Complete your first task",
      unlocked: tasksCompleted >= 1,
    },
    {
      id: "note-taker",
      title: "Note Taker",
      description: "Create your first note",
      unlocked: notes.length >= 1,
    },
    {
      id: "quiz-whiz",
      title: "Quiz Whiz",
      description: "Score 80% or higher on a quiz",
      unlocked: bestQuizScore >= 80,
    },
    {
      id: "flashcard-fanatic",
      title: "Flashcard Fanatic",
      description: "Reach 80% mastery on a deck",
      unlocked: bestDeckMastery >= 80,
    },
    {
      id: "three-day-streak",
      title: "On a Roll",
      description: "Maintain a 3-day study streak",
      unlocked: streak >= 3,
    },
    {
      id: "seven-day-streak",
      title: "Consistent",
      description: "Maintain a 7-day study streak",
      unlocked: streak >= 7,
    },
  ];
}

export async function getOverview() {
  const [streak, allTasks, notes, attempts, decks] = await Promise.all([
    getStudyStreak(),
    plannerService.getTasks(),
    notesService.getNotes(),
    quizService.getAttempts(),
    flashcardService.getDecks(),
  ]);

  const totalStudyMinutes = allTasks
    .filter(isCompletedStudyTask)
    .reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
  const tasksCompletedTotal = allTasks.filter((t) => t.completed).length;
  const decksStudied = decks.filter((d) => d.masteryPercent !== null).length;

  return {
    streak,
    totalStudyMinutes,
    tasksCompletedTotal,
    notesCount: notes.length,
    quizzesTaken: attempts.length,
    decksStudied,
  };
}
