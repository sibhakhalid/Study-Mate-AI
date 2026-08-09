import { dateKey, addDays } from "../../../utils/dateHelpers";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";

/** Same "still alive if today isn't done yet" rule used by the Progress page. */
export function computeStreak(tasks) {
  const completedDates = new Set(
    tasks.filter((t) => t.type === "study" && t.completed).map((t) => t.date)
  );

  let streak = 0;
  let cursor = new Date();
  if (!completedDates.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }
  while (completedDates.has(dateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function isCompletedStudyTask(task) {
  return task.type === "study" && task.completed;
}

export function computeMinutesInRange(tasks, startKey, endKey) {
  return tasks
    .filter((t) => isCompletedStudyTask(t) && t.date >= startKey && t.date <= endKey)
    .reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
}

export function computeOverview({ tasks, decks, attempts }) {
  const today = new Date();
  const weekStart = dateKey(addDays(today, -6));
  const todayKey = dateKey(today);

  return {
    streakDays: computeStreak(tasks),
    hoursThisWeek: Math.round((computeMinutesInRange(tasks, weekStart, todayKey) / 60) * 10) / 10,
    cardsReviewed: decks.reduce((sum, d) => sum + (d.reviewedCount || 0), 0),
    quizzesTaken: attempts.length,
  };
}

export function computeDailyProgress({ tasks, goalMinutes = 120 }) {
  const todayKey = dateKey(new Date());
  const minutesStudied = computeMinutesInRange(tasks, todayKey, todayKey);
  const percent = goalMinutes > 0 ? Math.min(100, Math.round((minutesStudied / goalMinutes) * 100)) : 0;
  return { percent, minutesStudied, goalMinutes };
}

export function buildStudyGoals(goals) {
  return goals.map((g) => ({
    id: g.id,
    label: g.label,
    progress: g.targetValue > 0 ? Math.min(100, Math.round((g.currentValue / g.targetValue) * 100)) : 0,
  }));
}

export function buildContinueLearning({ decks, notes, attempts }) {
  const deckItems = decks
    .filter((d) => d.masteryPercent !== null && d.masteryPercent !== undefined)
    .map((d) => ({
      id: `deck-${d.id}`,
      title: d.title,
      type: "Flashcards",
      progress: d.masteryPercent,
      to: "/flashcards",
      at: d.updatedAt,
    }));

  const noteItems = notes.map((n) => ({
    id: `note-${n.id}`,
    title: n.title,
    type: n.summary ? "Notes summary" : "Notes",
    progress: n.summary ? 100 : 40,
    to: `/notes/${n.id}`,
    at: n.updatedAt,
  }));

  const quizItems = attempts.map((a) => ({
    id: `quiz-${a.id}`,
    title: a.topicTitle,
    type: "Quiz",
    progress: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    to: "/quiz",
    at: a.completedAt,
  }));

  return [...deckItems, ...noteItems, ...quizItems]
    .filter((item) => item.at)
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 3);
}

export function buildRecentActivity({ notes, attempts, conversations }) {
  const noteEvents = notes.map((n) => ({
    id: `note-${n.id}`,
    label: n.summary ? `Summarized "${n.title}"` : `Updated "${n.title}"`,
    at: n.updatedAt,
    type: "notes",
  }));

  const quizEvents = attempts.map((a) => ({
    id: `quiz-${a.id}`,
    label: `Completed "${a.topicTitle}" quiz`,
    at: a.completedAt,
    type: "quiz",
  }));

  const tutorEvents = conversations
    .filter((c) => (c.messages || []).length > 0)
    .map((c) => ({
      id: `tutor-${c.id}`,
      label: `Asked AI Tutor: "${c.title}"`,
      at: c.updatedAt,
      type: "tutor",
    }));

  return [...noteEvents, ...quizEvents, ...tutorEvents]
    .filter((event) => event.at)
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 5)
    .map((event) => ({ ...event, time: formatRelativeTime(event.at) }));
}
