import { useCallback, useMemo, useReducer, useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { useQuiz } from "./hooks/useQuiz";
import * as quizService from "./services/quizService";
import QuizConfigModal from "./components/QuizConfigModal";
import QuizHistoryList from "./components/QuizHistoryList";
import QuestionCard from "./components/QuestionCard";
import QuizProgressBar from "./components/QuizProgressBar";
import QuizTimer from "./components/QuizTimer";
import QuizNavigation from "./components/QuizNavigation";
import QuizCompletionScreen from "./components/QuizCompletionScreen";
import AnswerReviewList from "./components/AnswerReviewList";
import { QuizEmptyState, QuizGeneratingState, QuizErrorState } from "./components/QuizStates";
import Button from "../../components/ui/Button";

const initialState = {
  phase: "idle", // idle | generating | active | completed | reviewing | error
  quiz: null,
  currentIndex: 0,
  answers: {},
  timeTakenSeconds: 0,
  errorMessage: null,
  lastConfig: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "GENERATE_START":
      return { ...state, phase: "generating", errorMessage: null, lastConfig: action.config };
    case "GENERATE_SUCCESS":
      return {
        ...state,
        phase: "active",
        quiz: action.quiz,
        currentIndex: 0,
        answers: {},
        timeTakenSeconds: 0,
      };
    case "GENERATE_ERROR":
      return { ...state, phase: "error", errorMessage: action.message };
    case "SELECT_ANSWER":
      return { ...state, answers: { ...state.answers, [state.currentIndex]: action.optionIndex } };
    case "NEXT_QUESTION":
      return { ...state, currentIndex: state.currentIndex + 1 };
    case "PREV_QUESTION":
      return { ...state, currentIndex: Math.max(0, state.currentIndex - 1) };
    case "TICK_TIMER":
      return { ...state, timeTakenSeconds: action.seconds };
    case "SUBMIT_QUIZ":
      return { ...state, phase: "completed" };
    case "REVIEW_ANSWERS":
      return { ...state, phase: "reviewing" };
    case "BACK_TO_RESULTS":
      return { ...state, phase: "completed" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function QuizPage() {
  const { attempts, loadingAttempts, recordAttempt } = useQuiz();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [configOpen, setConfigOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [recordError, setRecordError] = useState(null);

  const runGeneration = useCallback(async (config) => {
    setGenerating(true);
    dispatch({ type: "GENERATE_START", config });
    try {
      const result = await quizService.generateQuiz(config);
      dispatch({
        type: "GENERATE_SUCCESS",
        quiz: { topicId: config.topicId, topicTitle: config.topicTitle, questions: result.questions },
      });
      setConfigOpen(false);
    } catch (err) {
      dispatch({ type: "GENERATE_ERROR", message: err.message });
      setConfigOpen(false);
    } finally {
      setGenerating(false);
    }
  }, []);

  const score = useMemo(() => {
    if (!state.quiz) return 0;
    return state.quiz.questions.reduce(
      (count, q, i) => (state.answers[i] === q.correctIndex ? count + 1 : count),
      0
    );
  }, [state.quiz, state.answers]);

  async function handleSubmitQuiz() {
    dispatch({ type: "SUBMIT_QUIZ" });
    setRecordError(null);
    // In backend mode, the server grades from the full question set
    // (each item's correctIndex plus the student's selectedIndex) rather
    // than trusting a client-computed score — this is the payload that
    // makes that possible; mock mode ignores the extra fields.
    const gradedQuestions = state.quiz.questions.map((q, i) => ({
      ...q,
      selectedIndex: state.answers[i] ?? -1,
    }));
    try {
      await recordAttempt({
        topicId: state.quiz.topicId,
        topicTitle: state.quiz.topicTitle,
        questions: gradedQuestions,
        score,
        total: state.quiz.questions.length,
        timeTakenSeconds: state.timeTakenSeconds,
      });
    } catch (err) {
      // The results screen already shows the student's score either
      // way (it's computed client-side for immediate feedback) — but
      // without this, a failed save meant that score silently never
      // made it into quiz history or Progress, with nothing telling
      // the student their result didn't actually record.
      setRecordError(err.message || "Your score didn't save. Please check your connection.");
    }
  }

  if (state.phase === "generating") {
    return <QuizGeneratingState />;
  }

  if (state.phase === "error") {
    return (
      <QuizErrorState
        message={state.errorMessage}
        onRetry={() => runGeneration(state.lastConfig)}
      />
    );
  }

  if (state.phase === "active" && state.quiz) {
    const question = state.quiz.questions[state.currentIndex];
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <QuizProgressBar current={state.currentIndex} total={state.quiz.questions.length} />
          </div>
          <QuizTimer
            isRunning
            onTick={(seconds) => dispatch({ type: "TICK_TIMER", seconds })}
          />
        </div>

        <QuestionCard
          question={question}
          index={state.currentIndex}
          total={state.quiz.questions.length}
          selectedIndex={state.answers[state.currentIndex]}
          onSelect={(optionIndex) => dispatch({ type: "SELECT_ANSWER", optionIndex })}
          mode="active"
        />

        <QuizNavigation
          currentIndex={state.currentIndex}
          total={state.quiz.questions.length}
          hasAnswer={state.answers[state.currentIndex] !== undefined}
          onPrevious={() => dispatch({ type: "PREV_QUESTION" })}
          onNext={() => dispatch({ type: "NEXT_QUESTION" })}
          onSubmit={handleSubmitQuiz}
        />
      </div>
    );
  }

  if (state.phase === "completed" && state.quiz) {
    return (
      <div className="space-y-4">
        {recordError && (
          <div
            role="alert"
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 max-w-2xl mx-auto"
          >
            <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
            {recordError}
          </div>
        )}
        <QuizCompletionScreen
          score={score}
          total={state.quiz.questions.length}
          timeTakenSeconds={state.timeTakenSeconds}
          onReview={() => dispatch({ type: "REVIEW_ANSWERS" })}
          onRetake={() => runGeneration(state.lastConfig)}
          onBackToDashboard={() => dispatch({ type: "RESET" })}
        />
      </div>
    );
  }

  if (state.phase === "reviewing" && state.quiz) {
    return (
      <AnswerReviewList
        questions={state.quiz.questions}
        answers={state.answers}
        onBack={() => dispatch({ type: "BACK_TO_RESULTS" })}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">Quiz</h1>
        <Button variant="primary" icon={Plus} onClick={() => setConfigOpen(true)}>
          New quiz
        </Button>
      </div>

      {loadingAttempts ? (
        <p className="text-sm text-ink-faint text-center py-16">Loading your quiz history...</p>
      ) : attempts.length === 0 ? (
        <QuizEmptyState onStart={() => setConfigOpen(true)} />
      ) : (
        <QuizHistoryList attempts={attempts} />
      )}

      <QuizConfigModal
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
        onGenerate={runGeneration}
        generating={generating}
      />
    </div>
  );
}
