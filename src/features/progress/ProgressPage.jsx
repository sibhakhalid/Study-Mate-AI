import { useCallback, useEffect, useState } from "react";
import * as progressService from "./services/progressService";
import StreakCard from "./components/StreakCard";
import StatsOverviewGrid from "./components/StatsOverviewGrid";
import StudyTimeChart from "./components/StudyTimeChart";
import SubjectProgress from "./components/SubjectProgress";
import QuizPerformanceCard from "./components/QuizPerformanceCard";
import FlashcardMasteryCard from "./components/FlashcardMasteryCard";
import AchievementsGrid from "./components/AchievementsGrid";
import { ProgressLoadingState, ProgressErrorState, ProgressEmptyState } from "./components/ProgressStates";

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [quizPerformance, setQuizPerformance] = useState(null);
  const [flashcardDecks, setFlashcardDecks] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const [period, setPeriod] = useState("week");
  const [periodStats, setPeriodStats] = useState({ studyMinutes: 0, tasksCompleted: 0 });

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        overviewResult,
        chartResult,
        subjectsResult,
        quizResult,
        deckResult,
        achievementsResult,
      ] = await Promise.all([
        progressService.getOverview(),
        progressService.getStudyTimeSeries(14),
        progressService.getSubjectProgress(),
        progressService.getQuizPerformance(),
        progressService.getFlashcardMastery(),
        progressService.getAchievements(),
      ]);
      setOverview(overviewResult);
      setChartData(chartResult);
      setSubjects(subjectsResult);
      setQuizPerformance(quizResult);
      setFlashcardDecks(deckResult);
      setAchievements(achievementsResult);
    } catch (err) {
      setError(err.message || "Something went wrong loading your progress.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    progressService.getPeriodStats(period).then(setPeriodStats);
  }, [period]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-medium text-ink">Progress</h1>
        <ProgressLoadingState />
      </div>
    );
  }

  if (error) {
    return <ProgressErrorState message={error} onRetry={loadAll} />;
  }

  const isEmpty =
    overview.tasksCompletedTotal === 0 &&
    overview.notesCount === 0 &&
    overview.quizzesTaken === 0 &&
    overview.decksStudied === 0;

  if (isEmpty) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-medium text-ink">Progress</h1>
        <ProgressEmptyState />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-medium text-ink">Progress</h1>

      <div className="grid lg:grid-cols-3 gap-4">
        <StreakCard streak={overview.streak} />
        <div className="lg:col-span-2">
          <StatsOverviewGrid period={period} onPeriodChange={setPeriod} stats={periodStats} />
        </div>
      </div>

      <StudyTimeChart data={chartData} />

      <div className="grid lg:grid-cols-2 gap-4">
        <SubjectProgress subjects={subjects} />
        <div className="space-y-4">
          <QuizPerformanceCard performance={quizPerformance} />
          <FlashcardMasteryCard decks={flashcardDecks} />
        </div>
      </div>

      <AchievementsGrid achievements={achievements} />
    </div>
  );
}
