import * as studyAssistantService from "../services/studyAssistantService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const ask = asyncHandler(async (req, res) => {
  const result = await studyAssistantService.ask(req.user._id, req.body);
  new ApiResponse(200, result, "Answer generated").send(res);
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const result = await studyAssistantService.getRecommendations(req.user._id);
  new ApiResponse(200, result).send(res);
});
