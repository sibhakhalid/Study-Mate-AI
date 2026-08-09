import { Dna, Sigma, Landmark, Code2, Sparkles, BookOpen } from "lucide-react";

/**
 * Mongoose can't store a React component, so the backend's Deck.icon
 * field is a string (e.g. "Dna"). Mock decks, by contrast, import the
 * actual lucide-react component directly. This registry bridges the
 * two so DeckCard's `<deck.icon />` works identically regardless of
 * which mode the deck came from — components stay unchanged.
 */
const ICON_REGISTRY = {
  Dna,
  Sigma,
  Landmark,
  Code2,
  Sparkles,
  BookOpen,
};

export function resolveIcon(name) {
  return ICON_REGISTRY[name] || BookOpen;
}
