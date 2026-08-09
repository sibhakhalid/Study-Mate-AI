import { createContext, useCallback, useEffect, useState } from "react";
import * as quizService from "../services/quizService";
import { useAuth } from "../../auth/context/useAuth";

export const QuizContext = createContext(null);

/**
 * Deliberately does NOT hold active-quiz-session state (current question,
 * selected answers, timer) — that's ephemeral per-attempt state, owned
 * by QuizPage's local reducer. This context only holds what should
 * persist across visits: past attempt history.
 */
export function QuizProvider({ children }) {
  const { firebaseUser, initializing } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);

  const loadAttempts = useCallback(async () => {
    setLoadingAttempts(true);
    try {
      const result = await quizService.getAttempts();
      setAttempts(result);
    } finally {
      setLoadingAttempts(false);
    }
  }, []);

  // See NotesContext for why this waits for auth — same global-mount concern.
  useEffect(() => {
    if (initializing) return;
    if (firebaseUser) {
      loadAttempts();
    } else {
      setAttempts([]);
      setLoadingAttempts(false);
    }
  }, [firebaseUser, initializing, loadAttempts]);

  const recordAttempt = useCallback(async (attemptData) => {
    const attempt = await quizService.saveAttempt(attemptData);
    setAttempts((prev) => [attempt, ...prev]);
    return attempt;
  }, []);

  return (
    <QuizContext.Provider value={{ attempts, loadingAttempts, recordAttempt }}>
      {children}
    </QuizContext.Provider>
  );
}
