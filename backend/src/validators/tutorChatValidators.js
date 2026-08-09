import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.string().trim().min(1).max(4000),
});

export const listConversationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id"),
});
