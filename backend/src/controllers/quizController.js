import * as quizService from "../services/quizService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listTopics = asyncHandler(async (_req, res) => {
  new ApiResponse(200, quizService.listTopics()).send(res);
});

export const generateQuizHandler = asyncHandler(async (req, res) => {
  const quiz = await quizService.generateQuiz(req.user._id, req.body);
  new ApiResponse(200, quiz, "Quiz generated").send(res);
});

export const submitAttempt = asyncHandler(async (req, res) => {
  const attempt = await quizService.submitAttempt(req.user._id, req.body);
  new ApiResponse(201, attempt, "Attempt recorded").send(res);
});

export const listAttempts = asyncHandler(async (req, res) => {
  const { items, pagination } = await quizService.listAttempts(req.user._id, req.query);
  new ApiResponse(200, items, "Attempts retrieved").send(res, pagination);
});

export const getAttemptById = asyncHandler(async (req, res) => {
  const attempt = await quizService.getAttemptById(req.user._id, req.params.id);
  new ApiResponse(200, attempt).send(res);
});
