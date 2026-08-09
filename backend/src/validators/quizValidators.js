import { z } from "zod";

export const generateQuizSchema = z.object({
  topicId: z.string().trim().min(1).max(60),
  topicTitle: z.string().trim().min(1).max(200),
  sourceNoteId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  count: z.number().int().min(1).max(20).default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

const answeredQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().default(""),
  selectedIndex: z.number().int().min(-1).max(3),
});

export const submitAttemptSchema = z.object({
  topicId: z.string().trim().min(1).max(60),
  topicTitle: z.string().trim().min(1).max(200),
  questions: z.array(answeredQuestionSchema).min(1),
  timeTakenSeconds: z.number().int().min(0).max(36000).optional(),
});

export const listAttemptsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
