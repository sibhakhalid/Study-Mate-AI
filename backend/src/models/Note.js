import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200, default: "Untitled note" },
    content: { type: String, default: "", maxlength: 20000 },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    favorite: { type: Boolean, default: false },

    // AI-generated, via Gemini — see notesService.summarizeNote(). Null
    // until the student requests a summary; regenerated (not versioned)
    // each time they ask again, since notes change and a stale summary
    // would be actively misleading.
    summary: { type: String, default: null },
    summaryKeyPoints: [{ type: String }],
    summaryGeneratedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

noteSchema.index({ user: 1, updatedAt: -1 });
// Full-text search across title/content/tags, backing Notes' search bar.
noteSchema.index({ title: "text", content: "text", tags: "text" });

export const Note = mongoose.model("Note", noteSchema);
