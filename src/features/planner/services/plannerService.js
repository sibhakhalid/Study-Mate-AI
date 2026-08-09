import { seedTasks, seedGoals } from "../data/mockTasks";
import { apiRequest } from "../../../services/httpClient";
import { normalizeDoc, normalizeDocs } from "../../../utils/normalizeMongoDoc";

/**
 * Two implementations behind one interface — see notesService.js for
 * the full rationale. createTask()'s signature — {title, subjectId,
 * date, startTime, durationMinutes, type} in, a full task record out —
 * is exactly what the real backend (and eventually a "Gemini, schedule
 * my week" endpoint) takes and returns, so PlannerContext needed zero
 * changes to consume the real API.
 */

const USE_BACKEND = Boolean(import.meta.env.VITE_API_BASE_URL);

const TASKS_KEY = "studymate.plannerTasks";
const GOALS_KEY = "studymate.plannerGoals";
const LATENCY = 400;

function delay(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeId(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function readTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(seedTasks));
      return [...seedTasks];
    }
    return JSON.parse(raw);
  } catch {
    return [...seedTasks];
  }
}

function writeTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function readGoals() {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) {
      localStorage.setItem(GOALS_KEY, JSON.stringify(seedGoals));
      return [...seedGoals];
    }
    return JSON.parse(raw);
  } catch {
    return [...seedGoals];
  }
}

function writeGoals(goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

// --- Tasks ---

export async function getTasks() {
  if (USE_BACKEND) {
    const tasks = await apiRequest("/planner/tasks");
    return normalizeDocs(tasks);
  }

  await delay();
  return readTasks();
}

export async function createTask(data) {
  if (USE_BACKEND) {
    const task = await apiRequest("/planner/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return normalizeDoc(task);
  }

  await delay();
  const now = new Date().toISOString();
  const task = {
    id: makeId("t"),
    title: data.title,
    subjectId: data.subjectId,
    date: data.date,
    startTime: data.startTime || null,
    durationMinutes: data.durationMinutes || null,
    type: data.type,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  const tasks = readTasks();
  writeTasks([...tasks, task]);
  return task;
}

export async function updateTask(id, updates) {
  if (USE_BACKEND) {
    const task = await apiRequest(`/planner/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return normalizeDoc(task);
  }

  await delay();
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Task not found");
  const updated = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  tasks[index] = updated;
  writeTasks(tasks);
  return updated;
}

export async function deleteTask(id) {
  if (USE_BACKEND) {
    await apiRequest(`/planner/tasks/${id}`, { method: "DELETE" });
    return { success: true };
  }

  await delay(300);
  writeTasks(readTasks().filter((t) => t.id !== id));
  return { success: true };
}

export async function toggleTaskComplete(id) {
  if (USE_BACKEND) {
    const task = await apiRequest(`/planner/tasks/${id}/complete`, { method: "PATCH" });
    return normalizeDoc(task);
  }

  await delay(150);
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Task not found");
  tasks[index] = { ...tasks[index], completed: !tasks[index].completed };
  writeTasks(tasks);
  return tasks[index];
}

// --- Goals ---

export async function getGoals() {
  if (USE_BACKEND) {
    const goals = await apiRequest("/planner/goals");
    return normalizeDocs(goals);
  }

  await delay(300);
  return readGoals();
}

export async function createGoal(data) {
  if (USE_BACKEND) {
    const goal = await apiRequest("/planner/goals", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return normalizeDoc(goal);
  }

  await delay();
  const goal = { id: makeId("g"), currentValue: 0, ...data };
  const goals = readGoals();
  writeGoals([...goals, goal]);
  return goal;
}

export async function deleteGoal(id) {
  if (USE_BACKEND) {
    await apiRequest(`/planner/goals/${id}`, { method: "DELETE" });
    return { success: true };
  }

  await delay(250);
  writeGoals(readGoals().filter((g) => g.id !== id));
  return { success: true };
}
