import mongoose from "mongoose";

const plannerTaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subjectId: {
      type: String,
      enum: ["biology", "math", "history", "cs", "general"],
      default: "general",
    },
    // Stored as "YYYY-MM-DD" to match the frontend's dateKey() helper and
    // avoid timezone-shift bugs that a full Date would introduce for
    // calendar-grid lookups.
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    startTime: { type: String, default: null }, // "HH:MM"
    durationMinutes: { type: Number, default: null, min: 0 },
    type: { type: String, enum: ["study", "deadline"], default: "study" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);
plannerTaskSchema.index({ user: 1, date: 1 });

const studyGoalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    label: { type: String, required: true, trim: true, maxlength: 120 },
    targetValue: { type: Number, required: true, min: 0 },
    currentValue: { type: Number, default: 0, min: 0 },
    unit: { type: String, enum: ["hours", "tasks"], default: "tasks" },
  },
  { timestamps: true }
);

export const PlannerTask = mongoose.model("PlannerTask", plannerTaskSchema);
export const StudyGoal = mongoose.model("StudyGoal", studyGoalSchema);
