import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true, maxlength: 8000 },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const tutorConversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "New chat", maxlength: 120 },
    messages: [messageSchema],
  },
  { timestamps: true }
);
tutorConversationSchema.index({ user: 1, updatedAt: -1 });

export const TutorConversation = mongoose.model("TutorConversation", tutorConversationSchema);
