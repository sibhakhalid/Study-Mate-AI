import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  bio: z.string().trim().max(280).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  dailyGoalMinutes: z.number().int().min(0).max(1440).optional(),
  weekStartsOn: z.enum(["sunday", "monday"]).optional(),
});

export const updateNotificationsSchema = z.object({
  studyReminders: z.boolean().optional(),
  deadlineAlerts: z.boolean().optional(),
  weeklySummary: z.boolean().optional(),
  productUpdates: z.boolean().optional(),
});
