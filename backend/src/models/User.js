import mongoose from "mongoose";

/**
 * Firebase owns identity (email, password, Google sign-in). This model
 * only owns the app-specific profile data layered on top — exactly the
 * fields the frontend's SettingsContext already expects from
 * mockProfile.js (profile / preferences / notifications).
 */
const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    bio: { type: String, trim: true, maxlength: 280, default: "" },
    avatarUrl: { type: String, default: null },

    preferences: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      dailyGoalMinutes: { type: Number, min: 0, max: 1440, default: 120 },
      weekStartsOn: { type: String, enum: ["sunday", "monday"], default: "sunday" },
    },

    notifications: {
      studyReminders: { type: Boolean, default: true },
      deadlineAlerts: { type: Boolean, default: true },
      weeklySummary: { type: Boolean, default: false },
      productUpdates: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

userSchema.methods.toPublicProfile = function toPublicProfile() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    bio: this.bio,
    avatarUrl: this.avatarUrl,
  };
};

export const User = mongoose.model("User", userSchema);
