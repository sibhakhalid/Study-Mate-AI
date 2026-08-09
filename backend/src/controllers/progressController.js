import { getProgressSummary } from "../services/progressService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProgress = asyncHandler(async (req, res) => {
  const summary = await getProgressSummary(req.user._id);
  new ApiResponse(200, summary).send(res);
});
