import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Shuffle, Sparkles } from "lucide-react";
import { useFlashcards } from "./hooks/useFlashcards";
import * as flashcardService from "./services/flashcardService";
import DeckCard from "./components/DeckCard";
import FlashcardView from "./components/FlashcardView";
import StudyControls from "./components/StudyControls";
import FlashcardNavigation from "./components/FlashcardNavigation";
import SessionSummary from "./components/SessionSummary";
import GenerateDeckModal from "./components/GenerateDeckModal";
import {
  FlashcardsEmptyState,
  FlashcardsLoadingState,
  FlashcardsErrorState,
} from "./components/FlashcardsStates";
import StepProgressBar from "../../components/ui/StepProgressBar";
import Button from "../../components/ui/Button";

function naturalOrder(length) {
  return Array.from({ length }, (_, i) => i);
}

function shuffleOrder(length) {
  const order = naturalOrder(length);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const initialState = {
  phase: "browsing", // browsing | loading | studying | summary | error
  deck: null,
  cards: [],
  order: [],
  position: 0,
  flipped: false,
  known: {},
  needsReview: {},
  errorMessage: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_DECK_START":
      return { ...state, phase: "loading", deck: action.deck, errorMessage: null };
    case "SELECT_DECK_SUCCESS":
      return {
        ...state,
        phase: "studying",
        cards: action.cards,
        order: naturalOrder(action.cards.length),
        position: 0,
        flipped: false,
        known: {},
        needsReview: {},
      };
    case "SELECT_DECK_ERROR":
      return { ...state, phase: "error", errorMessage: action.message };
    case "FLIP":
      return { ...state, flipped: !state.flipped };
    case "NEXT":
      return { ...state, position: Math.min(state.position + 1, state.order.length - 1), flipped: false };
    case "PREV":
      return { ...state, position: Math.max(state.position - 1, 0), flipped: false };
    case "SHUFFLE":
      return { ...state, order: shuffleOrder(state.cards.length), position: 0, flipped: false };
    case "MARK_KNOWN": {
      const { [action.cardId]: _omit, ...restReview } = state.needsReview;
      return { ...state, known: { ...state.known, [action.cardId]: true }, needsReview: restReview };
    }
    case "MARK_NEEDS_REVIEW": {
      const { [action.cardId]: _omit, ...restKnown } = state.known;
      return { ...state, needsReview: { ...state.needsReview, [action.cardId]: true }, known: restKnown };
    }
    case "FINISH":
      return { ...state, phase: "summary" };
    case "RESTART_SESSION":
      return {
        ...state,
        phase: "studying",
        order: naturalOrder(state.cards.length),
        position: 0,
        flipped: false,
        known: {},
        needsReview: {},
      };
    case "REVIEW_MISSED": {
      const missedCards = state.cards.filter((c) => state.needsReview[c.id]);
      return {
        ...state,
        cards: missedCards,
        order: missedCards.map((_, i) => i),
        position: 0,
        flipped: false,
        known: {},
        needsReview: {},
        phase: "studying",
      };
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function FlashcardsPage() {
  const { decks, loadingDecks, recordSessionResult, generateDeck } = useFlashcards();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function handleGenerateDeck(params) {
    setGenerating(true);
    try {
      await generateDeck(params);
      setGenerateModalOpen(false);
    } finally {
      setGenerating(false);
    }
  }

  const loadDeck = useCallback(async (deck) => {
    dispatch({ type: "SELECT_DECK_START", deck });
    try {
      const cards = await flashcardService.getDeckCards(deck.id);
      dispatch({ type: "SELECT_DECK_SUCCESS", cards });
    } catch (err) {
      dispatch({ type: "SELECT_DECK_ERROR", message: err.message });
    }
  }, []);

  const currentCard = useMemo(() => {
    if (state.cards.length === 0) return null;
    return state.cards[state.order[state.position]];
  }, [state.cards, state.order, state.position]);

  const isLastCard = state.position === state.order.length - 1;

  function advanceOrFinish() {
    if (isLastCard) {
      dispatch({ type: "FINISH" });
    } else {
      dispatch({ type: "NEXT" });
    }
  }

  function handleMarkKnown() {
    dispatch({ type: "MARK_KNOWN", cardId: currentCard.id });
    advanceOrFinish();
  }

  function handleMarkNeedsReview() {
    dispatch({ type: "MARK_NEEDS_REVIEW", cardId: currentCard.id });
    advanceOrFinish();
  }

  const savedSessionRef = useRef(false);

  useEffect(() => {
    if (state.phase !== "summary") {
      savedSessionRef.current = false;
      return;
    }
    if (savedSessionRef.current) return;
    savedSessionRef.current = true;

    const knownCount = Object.keys(state.known).length;
    const total = state.cards.length;
    if (state.deck && total > 0) {
      // Fire-and-forget background sync (mastery tracking) — not
      // something the student is actively watching a button for, but
      // still needs a .catch() or a failure here becomes an unhandled
      // promise rejection with no visible cause.
      recordSessionResult(state.deck.id, {
        knownCount,
        total,
        known: state.known,
        needsReview: state.needsReview,
      }).catch((err) => {
        console.error("Couldn't save this study session's results:", err.message);
      });
    }
  }, [state.phase, state.known, state.cards, state.deck, recordSessionResult]);

  if (state.phase === "loading") {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center">
        <p className="text-sm text-ink-faint">Loading deck...</p>
      </div>
    );
  }

  if (state.phase === "error") {
    return (
      <FlashcardsErrorState
        message={state.errorMessage}
        onRetry={() => loadDeck(state.deck)}
      />
    );
  }

  if (state.phase === "studying" && currentCard) {
    const knownCount = Object.keys(state.known).length;
    const reviewCount = Object.keys(state.needsReview).length;
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <StepProgressBar current={state.position} total={state.order.length} itemLabel="Card" />
          </div>
          <button
            onClick={() => dispatch({ type: "SHUFFLE" })}
            aria-label="Shuffle cards"
            className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink px-2.5 py-1.5 rounded-lg hover:bg-primary-soft/60 transition-colors shrink-0"
          >
            <Shuffle size={15} strokeWidth={1.75} />
            Shuffle
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-ink-faint">
          <span>{knownCount} known</span>
          <span>&middot;</span>
          <span>{reviewCount} needs review</span>
        </div>

        <FlashcardView
          front={currentCard.front}
          back={currentCard.back}
          flipped={state.flipped}
          onFlip={() => dispatch({ type: "FLIP" })}
        />

        <StudyControls onMarkKnown={handleMarkKnown} onMarkNeedsReview={handleMarkNeedsReview} />

        <FlashcardNavigation
          currentIndex={state.position}
          total={state.order.length}
          onPrevious={() => dispatch({ type: "PREV" })}
          onNext={() => dispatch({ type: "NEXT" })}
        />
      </div>
    );
  }

  if (state.phase === "summary") {
    const knownCount = Object.keys(state.known).length;
    const reviewCount = Object.keys(state.needsReview).length;
    return (
      <SessionSummary
        knownCount={knownCount}
        reviewCount={reviewCount}
        total={state.cards.length}
        onReviewMissed={() => dispatch({ type: "REVIEW_MISSED" })}
        onStudyAgain={() => dispatch({ type: "RESTART_SESSION" })}
        onBackToDecks={() => dispatch({ type: "RESET" })}
      />
    );
  }

  // --- Browsing: deck grid ---
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">Flashcards</h1>
        <Button variant="primary" icon={Sparkles} onClick={() => setGenerateModalOpen(true)}>
          Generate with AI
        </Button>
      </div>

      {loadingDecks ? (
        <FlashcardsLoadingState />
      ) : decks.length === 0 ? (
        <FlashcardsEmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} onSelect={loadDeck} />
          ))}
        </div>
      )}

      <GenerateDeckModal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onGenerate={handleGenerateDeck}
        generating={generating}
      />
    </div>
  );
}
