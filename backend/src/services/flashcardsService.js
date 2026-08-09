import { Deck, Card } from "../models/Flashcard.js";
import { Note } from "../models/Note.js";
import { generateFlashcards } from "./geminiService.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, paginateQuery } from "../utils/pagination.js";

export async function listDecks(userId, query) {
  const pagination = parsePagination(query);
  const { items, pagination: meta } = await paginateQuery(
    Deck,
    { user: userId },
    pagination,
    { sort: { createdAt: -1 } }
  );

  // Attach lightweight counts rather than a full aggregation pipeline —
  // a page of decks is at most `limit` (100) documents, so N+1-safe
  // with Promise.all is simpler than $lookup here and easy to read.
  // knownCount/reviewedCount travel alongside cardCount so the frontend
  // can derive each deck's mastery and "cards reviewed" from this
  // user's real, persisted per-card review state — not from a
  // browser-local cache that would leak between accounts sharing a
  // device or reset on a new device.
  const withCounts = await Promise.all(
    items.map(async (deck) => {
      const [cardCount, knownCount, reviewedCount] = await Promise.all([
        Card.countDocuments({ deck: deck._id }),
        Card.countDocuments({ deck: deck._id, reviewState: "known" }),
        Card.countDocuments({ deck: deck._id, lastReviewedAt: { $ne: null } }),
      ]);
      return { ...deck.toObject(), cardCount, knownCount, reviewedCount };
    })
  );

  return { items: withCounts, pagination: meta };
}

export async function getDeck(userId, deckId) {
  const deck = await Deck.findOne({ _id: deckId, user: userId });
  if (!deck) throw ApiError.notFound("Deck not found");
  return deck;
}

export async function createDeck(userId, data) {
  return Deck.create({ ...data, user: userId });
}

export async function deleteDeck(userId, deckId) {
  const deck = await Deck.findOneAndDelete({ _id: deckId, user: userId });
  if (!deck) throw ApiError.notFound("Deck not found");
  await Card.deleteMany({ deck: deck._id });
}

export async function listDeckCards(userId, deckId) {
  const deck = await Deck.findOne({ _id: deckId, user: userId });
  if (!deck) throw ApiError.notFound("Deck not found");
  return Card.find({ deck: deck._id }).sort({ createdAt: 1 });
}

/**
 * Generates a new deck + its cards from a topic (and optionally an
 * existing note as source material) via Gemini, then persists both in
 * one call — the caller gets back a ready-to-study deck.
 */
export async function generateDeck(userId, { topic, sourceNoteId, count, icon }) {
  let sourceText;
  if (sourceNoteId) {
    const note = await Note.findOne({ _id: sourceNoteId, user: userId });
    if (!note) throw ApiError.notFound("Source note not found");
    sourceText = note.content;
  }

  const generatedCards = await generateFlashcards({ topic, sourceText, count });

  const deck = await Deck.create({
    user: userId,
    title: topic,
    description: sourceText ? "Generated from your note" : `AI-generated flashcards on ${topic}`,
    icon,
    sourceNote: sourceNoteId || null,
  });

  const cards = await Card.insertMany(
    generatedCards.map((c) => ({ deck: deck._id, user: userId, front: c.front, back: c.back }))
  );

  return { deck, cards };
}

export async function reviewCard(userId, cardId, reviewState) {
  const card = await Card.findOneAndUpdate(
    { _id: cardId, user: userId },
    { reviewState, lastReviewedAt: new Date() },
    { new: true }
  );
  if (!card) throw ApiError.notFound("Card not found");
  return card;
}
