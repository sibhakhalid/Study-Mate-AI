/**
 * Single source of mock data for the whole workspace.
 * DashboardPage reads this and distributes slices to each section via
 * props — sections never import this file directly. When a real API
 * exists, only DashboardPage's data-fetching changes; this file's shape
 * is what the API response should match.
 */

export const mockUser = {
  name: "Sibha",
};

export const mockOverview = {
  streakDays: 12,
  hoursThisWeek: 8.5,
  cardsReviewed: 142,
  quizzesTaken: 6,
};

export const mockDailyProgress = {
  percent: 65,
  minutesStudied: 78,
  goalMinutes: 120,
};

export const mockQuickActions = [
  { id: "upload-notes", label: "Upload notes", to: "/notes" },
  { id: "new-quiz", label: "Generate a quiz", to: "/quiz" },
  { id: "review-cards", label: "Review flashcards", to: "/flashcards" },
  { id: "ask-tutor", label: "Ask the AI tutor", to: "/ai-tutor" },
];

export const mockContinueLearning = [
  { id: "c1", title: "Cell Biology — Ch. 4", type: "Flashcards", progress: 72, to: "/flashcards" },
  { id: "c2", title: "Linear Algebra Basics", type: "Notes summary", progress: 40, to: "/notes" },
  { id: "c3", title: "World History Midterm", type: "Quiz", progress: 15, to: "/quiz" },
];

export const mockAiTools = [
  { id: "notes", title: "AI Notes", description: "Summarize messy notes instantly.", to: "/notes", featured: true },
  { id: "tutor", title: "AI Tutor", description: "Ask anything, get explained through.", to: "/ai-tutor" },
  { id: "quiz", title: "Quiz Generator", description: "Auto-built quizzes from your material.", to: "/quiz" },
  { id: "flashcards", title: "Flashcards", description: "Spaced-repetition decks, ready to review.", to: "/flashcards" },
  { id: "planner", title: "Study Planner", description: "A schedule built around your deadlines.", to: "/planner" },
];

export const mockRecentActivity = [
  { id: "a1", label: "Completed \"Cell Biology\" quiz", time: "2 hours ago", type: "quiz" },
  { id: "a2", label: "Reviewed 24 flashcards", time: "5 hours ago", type: "flashcards" },
  { id: "a3", label: "Summarized \"Linear Algebra Ch.3\"", time: "Yesterday", type: "notes" },
  { id: "a4", label: "Asked AI Tutor about eigenvectors", time: "Yesterday", type: "tutor" },
];

export const mockStudyGoals = [
  { id: "g1", label: "Study 10 hours this week", progress: 85 },
  { id: "g2", label: "Review 200 flashcards", progress: 71 },
  { id: "g3", label: "Complete 5 quizzes", progress: 60 },
];
