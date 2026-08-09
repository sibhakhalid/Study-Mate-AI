import { PlannerTask, StudyGoal } from "../models/Planner.js";
import { ApiError } from "../utils/ApiError.js";

export async function listTasks(userId, { from, to }) {
  const filter = { user: userId };
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = from;
    if (to) filter.date.$lte = to;
  }
  // Not paginated: a date-range query (typically one calendar view) is
  // naturally bounded, unlike a global list — pagination here would add
  // complexity the frontend's calendar-grid usage never needs.
  return PlannerTask.find(filter).sort({ date: 1, startTime: 1 });
}

export async function createTask(userId, data) {
  return PlannerTask.create({ ...data, user: userId });
}

export async function updateTask(userId, taskId, updates) {
  const task = await PlannerTask.findOneAndUpdate(
    { _id: taskId, user: userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!task) throw ApiError.notFound("Task not found");
  return task;
}

export async function deleteTask(userId, taskId) {
  const task = await PlannerTask.findOneAndDelete({ _id: taskId, user: userId });
  if (!task) throw ApiError.notFound("Task not found");
}

export async function toggleTaskCompletion(userId, taskId) {
  const task = await PlannerTask.findOne({ _id: taskId, user: userId });
  if (!task) throw ApiError.notFound("Task not found");
  task.completed = !task.completed;
  await task.save();
  return task;
}

// ── Study goals ──────────────────────────────────────────────────────

export async function listGoals(userId) {
  return StudyGoal.find({ user: userId });
}

export async function createGoal(userId, data) {
  return StudyGoal.create({ ...data, user: userId });
}

export async function updateGoal(userId, goalId, updates) {
  const goal = await StudyGoal.findOneAndUpdate(
    { _id: goalId, user: userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!goal) throw ApiError.notFound("Goal not found");
  return goal;
}

export async function deleteGoal(userId, goalId) {
  const goal = await StudyGoal.findOneAndDelete({ _id: goalId, user: userId });
  if (!goal) throw ApiError.notFound("Goal not found");
}
