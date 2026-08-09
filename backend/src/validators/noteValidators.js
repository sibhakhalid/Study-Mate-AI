import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().max(200).optional(),
  content: z.string().max(20000).default(""),
  tags: z.array(z.string().trim().max(40)).default([]),
});

export const updateNoteSchema = z.object({
  title: z.string().trim().max(200).optional(),
  content: z.string().max(20000).optional(),
  tags: z.array(z.string().trim().max(40)).optional(),
  favorite: z.boolean().optional(),
});

export const listNotesQuerySchema = z.object({
  searchTerm: z.string().trim().max(200).optional(),
  tag: z.string().trim().max(40).optional(),
  favorite: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id"),
});
