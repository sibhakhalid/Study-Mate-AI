import * as plannerService from "../services/plannerService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listTasks = asyncHandler(async (req, res) => {
  const tasks = await plannerService.listTasks(req.user._id, req.query);
  new ApiResponse(200, tasks).send(res);
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await plannerService.createTask(req.user._id, req.body);
  new ApiResponse(201, task, "Task created").send(res);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await plannerService.updateTask(req.user._id, req.params.id, req.body);
  new ApiResponse(200, task, "Task updated").send(res);
});

export const deleteTask = asyncHandler(async (req, res) => {
  await plannerService.deleteTask(req.user._id, req.params.id);
  new ApiResponse(200, { id: req.params.id }, "Task deleted").send(res);
});

export const toggleTaskCompletion = asyncHandler(async (req, res) => {
  const task = await plannerService.toggleTaskCompletion(req.user._id, req.params.id);
  new ApiResponse(200, task, "Task completion toggled").send(res);
});

export const listGoals = asyncHandler(async (req, res) => {
  const goals = await plannerService.listGoals(req.user._id);
  new ApiResponse(200, goals).send(res);
});

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await plannerService.createGoal(req.user._id, req.body);
  new ApiResponse(201, goal, "Goal created").send(res);
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await plannerService.updateGoal(req.user._id, req.params.id, req.body);
  new ApiResponse(200, goal, "Goal updated").send(res);
});

export const deleteGoal = asyncHandler(async (req, res) => {
  await plannerService.deleteGoal(req.user._id, req.params.id);
  new ApiResponse(200, { id: req.params.id }, "Goal deleted").send(res);
});
