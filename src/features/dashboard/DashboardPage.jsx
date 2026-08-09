import WelcomeHeader from "./components/WelcomeHeader";
import StudyOverview from "./components/StudyOverview";
import DailyProgress from "./components/DailyProgress";
import QuickActions from "./components/QuickActions";
import ContinueLearning from "./components/ContinueLearning";
import AiToolsOverview from "./components/AiToolsOverview";
import RecentActivity from "./components/RecentActivity";
import StudyGoalsWidget from "./components/StudyGoalsWidget";
import StudyAssistantWidget from "./components/StudyAssistantWidget";
import { useAuth } from "../auth/context/useAuth";
import { useNotes } from "../notes/hooks/useNotes";
import { useQuiz } from "../quiz/hooks/useQuiz";
import { useFlashcards } from "../flashcards/hooks/useFlashcards";
import { usePlanner } from "../planner/hooks/usePlanner";
import { useTutorChat } from "../tutor-chat/hooks/useTutorChat";
import { mockQuickActions, mockAiTools } from "./data/mockDashboardData";
import {
  computeOverview,
  computeDailyProgress,
  buildStudyGoals,
  buildContinueLearning,
  buildRecentActivity,
} from "./utils/deriveDashboardData";

/**
 * DashboardPage is a pure composition layer: every section's data is
 * derived from this user's real, already-loaded state in the app's
 * global feature contexts (Notes/Quiz/Flashcards/Planner/AI Tutor —
 * see App.jsx's provider tree). Nothing here is fetched separately,
 * invented, or shared between accounts. Quick actions and the AI tools
 * overview are static navigation shortcuts, not user data, so those
 * two stay as fixed lists — same as before.
 */
export default function DashboardPage() {
  const { profile, firebaseUser } = useAuth();
  const { notes, loading: notesLoading } = useNotes();
  const { attempts, loadingAttempts } = useQuiz();
  const { decks, loadingDecks } = useFlashcards();
  const { tasks, goals, loading: plannerLoading } = usePlanner();
  const { conversations, loadingConversations } = useTutorChat();

  const isLoading =
    notesLoading || loadingAttempts || loadingDecks || plannerLoading || loadingConversations;

  const displayName = profile?.name || firebaseUser?.displayName || "there";

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-24 text-center">
        <p className="text-sm text-ink-faint">Loading your dashboard...</p>
      </div>
    );
  }

  const overview = computeOverview({ tasks, decks, attempts });
  const dailyProgress = computeDailyProgress({
    tasks,
    goalMinutes: profile?.preferences?.dailyGoalMinutes || 120,
  });
  const studyGoals = buildStudyGoals(goals);
  const continueLearning = buildContinueLearning({ decks, notes, attempts });
  const recentActivity = buildRecentActivity({ notes, attempts, conversations });

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <WelcomeHeader name={displayName} />

      <StudyOverview data={overview} />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DailyProgress data={dailyProgress} />
        </div>
        <StudyGoalsWidget goals={studyGoals} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <section>
            <h2 className="font-display text-lg font-medium text-ink mb-4">
              Quick actions
            </h2>
            <QuickActions actions={mockQuickActions} />
          </section>
        </div>
        <StudyAssistantWidget />
      </div>

      <section>
        <h2 className="font-display text-lg font-medium text-ink mb-4">
          Continue learning
        </h2>
        <ContinueLearning items={continueLearning} />
      </section>

      <section>
        <h2 className="font-display text-lg font-medium text-ink mb-4">
          AI tools
        </h2>
        <AiToolsOverview tools={mockAiTools} />
      </section>

      <RecentActivity items={recentActivity} />
    </div>
  );
}
