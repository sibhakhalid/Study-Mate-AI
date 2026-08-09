import { z } from "zod";

export const listDecksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const createDeckSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(300).default(""),
  icon: z.string().trim().max(60).default("BookOpen"),
});

export const generateDeckSchema = z.object({
  topic: z.string().trim().min(2).max(200),
  sourceNoteId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  count: z.number().int().min(1).max(20).default(8),
  icon: z.string().trim().max(60).default("Sparkles"),
});

export const reviewCardSchema = z.object({
  reviewState: z.enum(["new", "learning", "known"]),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id"),
});
