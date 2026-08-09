import { useContext } from "react";
import { FlashcardsContext } from "../context/FlashcardsContext";

export function useFlashcards() {
  const ctx = useContext(FlashcardsContext);
  if (!ctx) {
    throw new Error("useFlashcards must be used within a FlashcardsProvider");
  }
  return ctx;
}
