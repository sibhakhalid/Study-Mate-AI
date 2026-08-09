import mongoose from "mongoose";

const deckSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 300, default: "" },
    // Name of a lucide-react icon (e.g. "Dna"), resolved to a component on the frontend.
    icon: { type: String, default: "BookOpen" },
    sourceNote: { type: mongoose.Schema.Types.ObjectId, ref: "Note", default: null },
  },
  { timestamps: true }
);
deckSchema.index({ user: 1, createdAt: -1 });

/**
 * SRS-lite: three states rather than a full spaced-repetition schedule.
 * Enough to power "study again" filtering and the mastery stat on the
 * Progress page today; can graduate to interval-based SRS later without
 * changing the API shape (just add fields).
 */
const cardSchema = new mongoose.Schema(
  {
    deck: { type: mongoose.Schema.Types.ObjectId, ref: "Deck", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    front: { type: String, required: true, maxlength: 500 },
    back: { type: String, required: true, maxlength: 1000 },
    reviewState: {
      type: String,
      enum: ["new", "learning", "known"],
      default: "new",
    },
    lastReviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
cardSchema.index({ deck: 1 });

export const Deck = mongoose.model("Deck", deckSchema);
export const Card = mongoose.model("Card", cardSchema);
