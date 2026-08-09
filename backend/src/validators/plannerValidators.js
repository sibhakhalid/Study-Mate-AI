import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  subjectId: z.enum(["biology", "math", "history", "cs", "general"]).default("general"),
  date: dateString,
  startTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  durationMinutes: z.number().int().min(0).nullable().optional(),
  type: z.enum(["study", "deadline"]).default("study"),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});

export const listTasksQuerySchema = z.object({
  from: dateString.optional(),
  to: dateString.optional(),
});

export const updateGoalSchema = z.object({
  currentValue: z.number().min(0).optional(),
  targetValue: z.number().min(0).optional(),
  label: z.string().trim().min(1).max(120).optional(),
});

export const createGoalSchema = z.object({
  label: z.string().trim().min(1).max(120),
  targetValue: z.number().min(0),
  unit: z.enum(["hours", "tasks"]).default("tasks"),
});
