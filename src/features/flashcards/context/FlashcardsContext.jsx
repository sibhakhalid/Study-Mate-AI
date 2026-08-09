import { createContext, useCallback, useEffect, useState } from "react";
import * as flashcardService from "../services/flashcardService";
import { useAuth } from "../../auth/context/useAuth";

export const FlashcardsContext = createContext(null);

/**
 * Same principle as QuizContext: holds only what should persist across
 * visits (deck list + mastery %). Active study-session state (current
 * card, flip, shuffle order, this session's marks) is local to
 * FlashcardsPage's reducer — it's ephemeral, not a resource.
 */
export function FlashcardsProvider({ children }) {
  const { firebaseUser, initializing } = useAuth();
  const [decks, setDecks] = useState([]);
  const [loadingDecks, setLoadingDecks] = useState(true);

  const loadDecks = useCallback(async () => {
    setLoadingDecks(true);
    try {
      const result = await flashcardService.getDecks();
      setDecks(result);
    } finally {
      setLoadingDecks(false);
    }
  }, []);

  // See NotesContext for why this waits for auth — same global-mount concern.
  useEffect(() => {
    if (initializing) return;
    if (firebaseUser) {
      loadDecks();
    } else {
      setDecks([]);
      setLoadingDecks(false);
    }
  }, [firebaseUser, initializing, loadDecks]);

  const recordSessionResult = useCallback(async (deckId, result) => {
    await flashcardService.saveSessionResult(deckId, result);
    await loadDecks(); // refresh mastery badges on the deck grid
  }, [loadDecks]);

  const generateDeck = useCallback(async (params) => {
    const result = await flashcardService.generateDeck(params);
    setDecks((prev) => [result.deck, ...prev]);
    return result;
  }, []);

  return (
    <FlashcardsContext.Provider value={{ decks, loadingDecks, recordSessionResult, generateDeck }}>
      {children}
    </FlashcardsContext.Provider>
  );
}
