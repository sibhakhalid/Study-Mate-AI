import * as tutorChatService from "../services/tutorChatService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listConversations = asyncHandler(async (req, res) => {
  const { items, pagination } = await tutorChatService.listConversations(req.user._id, req.query);
  new ApiResponse(200, items, "Conversations retrieved").send(res, pagination);
});

export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await tutorChatService.getConversation(req.user._id, req.params.id);
  new ApiResponse(200, conversation).send(res);
});

export const createConversation = asyncHandler(async (req, res) => {
  const conversation = await tutorChatService.createConversation(req.user._id);
  new ApiResponse(201, conversation, "Conversation created").send(res);
});

export const deleteConversation = asyncHandler(async (req, res) => {
  await tutorChatService.deleteConversation(req.user._id, req.params.id);
  new ApiResponse(200, { id: req.params.id }, "Conversation deleted").send(res);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await tutorChatService.sendMessage(
    req.user._id,
    req.params.id,
    req.body.content
  );
  new ApiResponse(200, conversation, "Message sent").send(res);
});
