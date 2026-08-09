import { addDays, dateKey } from "../utils/dateHelpers";

const today = new Date();

function d(offset) {
  return dateKey(addDays(today, offset));
}

export const seedTasks = [
  { id: "t1", title: "Review Cell Biology flashcards", subjectId: "biology", date: d(-1), startTime: "18:00", durationMinutes: 30, type: "study", completed: true },
  { id: "t2", title: "Linear Algebra problem set", subjectId: "math", date: d(0), startTime: "10:00", durationMinutes: 60, type: "study", completed: false },
  { id: "t3", title: "Read WWI chapter notes", subjectId: "history", date: d(0), startTime: "15:00", durationMinutes: 45, type: "study", completed: false },
  { id: "t4", title: "Data Structures quiz", subjectId: "cs", date: d(1), startTime: "09:00", durationMinutes: 30, type: "deadline", completed: false },
  { id: "t5", title: "Biology lab report due", subjectId: "biology", date: d(2), startTime: "23:59", durationMinutes: null, type: "deadline", completed: false },
  { id: "t6", title: "Practice eigenvector problems", subjectId: "math", date: d(3), startTime: "14:00", durationMinutes: 45, type: "study", completed: false },
  { id: "t7", title: "History midterm", subjectId: "history", date: d(5), startTime: "11:00", durationMinutes: 90, type: "deadline", completed: false },
  { id: "t8", title: "Big-O cheat sheet review", subjectId: "cs", date: d(4), startTime: "16:00", durationMinutes: 20, type: "study", completed: false },
  { id: "t9", title: "Weekly flashcard review", subjectId: "general", date: d(6), startTime: "19:00", durationMinutes: 30, type: "study", completed: false },
  { id: "t10", title: "Submit study planner reflection", subjectId: "general", date: d(-3), startTime: "12:00", durationMinutes: null, type: "deadline", completed: true },
];

export const seedGoals = [
  { id: "g1", label: "Study 10 hours this week", targetValue: 10, currentValue: 6.5, unit: "hours" },
  { id: "g2", label: "Complete 5 study tasks", targetValue: 5, currentValue: 2, unit: "tasks" },
];
