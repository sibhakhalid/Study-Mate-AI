import { mockDecks } from "../data/mockDecks";
import { mockCardBank } from "../data/mockCardBank";
import { apiRequest, isBackendConfigured } from "../../../services/httpClient";
import { normalizeDoc, normalizeDocs } from "../../../utils/normalizeMongoDoc";
import { resolveIcon } from "../utils/iconRegistry";

/**
 * Two implementations behind one interface — see notesService.js for
 * the full rationale. Backend mode calls the real Gemini-backed
 * /flashcards/decks/generate endpoint; mock mode keeps the original
 * hand-authored deck/card bank so the app stays demoable without a
 * backend running.
 *
 * To test the error state: select "Force error (testing)" as the deck.
 */

const USE_BACKEND = isBackendConfigured;

const PROGRESS_KEY = "studymate.flashcardMastery";
const LATENCY = 500;

function delay(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readMastery() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMastery(mastery) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(mastery));
}

// Backend decks carry `icon` as a string name; DeckCard renders
// `<deck.icon />` expecting an actual component either way.
function normalizeDeck(deck) {
  const doc = normalizeDoc(deck);
  return { ...doc, icon: resolveIcon(doc.icon) };
}

export async function getDecks() {
  if (USE_BACKEND) {
    // See notesService.getNotes for why an explicit limit matters —
    // same truncation risk applies to the deck list.
    const decks = await apiRequest("/flashcards/decks?limit=100");
    // Mastery is derived from this user's real per-card review state
    // (returned by the backend as cardCount/knownCount), not from
    // localStorage — localStorage is per-browser, not per-user, and
    // would leak one account's progress into another on a shared device.
    return normalizeDocs(decks).map((deck) => ({
      ...normalizeDeck(deck),
      masteryPercent:
        deck.cardCount > 0 ? Math.round((deck.knownCount / deck.cardCount) * 100) : null,
    }));
  }

  await delay(300);
  const mastery = readMastery();
  return mockDecks.map((deck) => ({
    ...deck,
    cardCount: mockCardBank[deck.id]?.length ?? 0,
    masteryPercent: mastery[deck.id]?.percent ?? null,
  }));
}

export async function getDeckCards(deckId) {
  if (USE_BACKEND) {
    const cards = await apiRequest(`/flashcards/decks/${deckId}/cards`);
    return normalizeDocs(cards);
  }

  await delay();
  if (deckId === "force-error") {
    throw new Error("Couldn't load this deck. Please try again.");
  }
  const cards = mockCardBank[deckId];
  if (!cards || cards.length === 0) {
    throw new Error("No cards available in this deck yet.");
  }
  return cards.map((card, i) => ({ id: `${deckId}-${i}`, ...card }));
}

/**
 * AI-powered — generates a new deck + its cards via Gemini from a
 * topic (and optionally an existing note as source material). Requires
 * a connected backend; there's no meaningful mock for "understand this
 * topic and write flashcards," so this throws clearly rather than
 * faking generated content.
 */
export async function generateDeck({ topic, sourceNoteId, count = 8, icon = "Sparkles" }) {
  if (!USE_BACKEND) {
    throw new Error(
      "AI flashcard generation needs a connected backend. Set VITE_API_BASE_URL to use this feature."
    );
  }
  const result = await apiRequest("/flashcards/decks/generate", {
    method: "POST",
    body: JSON.stringify({ topic, sourceNoteId, count, icon }),
  });
  return {
    deck: { ...normalizeDeck(result.deck), cardCount: result.cards.length, masteryPercent: null },
    cards: normalizeDocs(result.cards),
  };
}

/**
 * Persists this session's outcome. In backend mode, each card's
 * individual review state (known / needs-review) is synced via the
 * per-card review endpoint — not just a rolled-up percentage — so
 * server-side mastery tracking (and Progress's flashcard stats) stay
 * accurate. `known`/`needsReview` are {cardId: true} maps from
 * FlashcardsPage's session state.
 */
export async function saveSessionResult(deckId, { knownCount, total, known = {}, needsReview = {} }) {
  const percent = total > 0 ? Math.round((knownCount / total) * 100) : 0;

  if (USE_BACKEND) {
    const reviews = [
      ...Object.keys(known).map((cardId) => reviewCard(cardId, "known")),
      ...Object.keys(needsReview).map((cardId) => reviewCard(cardId, "learning")),
    ];
    // Best-effort: one card's review failing to sync shouldn't block
    // the session summary from showing — Promise.allSettled rather
    // than Promise.all.
    await Promise.allSettled(reviews);
    // Mastery itself is derived server-side (per-user, per-card) the
    // next time getDecks() runs — nothing to cache locally here.
    return { percent, knownCount, total, studiedAt: new Date().toISOString() };
  }

  await delay(200);
  const mastery = readMastery();
  mastery[deckId] = { percent, knownCount, total, studiedAt: new Date().toISOString() };
  writeMastery(mastery);
  return mastery[deckId];
}

async function reviewCard(cardId, reviewState) {
  return apiRequest(`/flashcards/cards/${cardId}/review`, {
    method: "PATCH",
    body: JSON.stringify({ reviewState }),
  });
}
