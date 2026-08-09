import { TutorConversation } from "../models/TutorConversation.js";
import { generateTutorReply } from "./geminiService.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, paginateQuery } from "../utils/pagination.js";

export async function listConversations(userId, query) {
  const pagination = parsePagination(query);
  return paginateQuery(
    TutorConversation,
    { user: userId },
    pagination,
    { sort: { updatedAt: -1 }, select: "-messages" } // list view: titles only, not full transcripts
  );
}

export async function createConversation(userId) {
  return TutorConversation.create({ user: userId, messages: [] });
}

export async function getConversation(userId, conversationId) {
  const conversation = await TutorConversation.findOne({ _id: conversationId, user: userId });
  if (!conversation) throw ApiError.notFound("Conversation not found");
  return conversation;
}

export async function deleteConversation(userId, conversationId) {
  const conversation = await TutorConversation.findOneAndDelete({
    _id: conversationId,
    user: userId,
  });
  if (!conversation) throw ApiError.notFound("Conversation not found");
}

/**
 * Appends the user's message, calls Gemini with the full prior history
 * for context, appends the reply, and persists both in one round trip.
 */
export async function sendMessage(userId, conversationId, content) {
  const conversation = await TutorConversation.findOne({ _id: conversationId, user: userId });
  if (!conversation) throw ApiError.notFound("Conversation not found");

  const isFirstMessage = conversation.messages.length === 0;
  const history = conversation.messages.map((m) => ({ role: m.role, content: m.content }));

  conversation.messages.push({ role: "user", content, timestamp: new Date() });
  if (isFirstMessage) {
    conversation.title = content.slice(0, 48);
  }

  const replyText = await generateTutorReply({ history, message: content });
  conversation.messages.push({ role: "assistant", content: replyText, timestamp: new Date() });

  await conversation.save();
  return conversation;
}
