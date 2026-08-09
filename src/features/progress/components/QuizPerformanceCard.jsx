import { HelpCircle } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";

export default function QuizPerformanceCard({ performance }) {
  return (
    <Card variant="default">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-medium text-ink">Quiz performance</h3>
        <HelpCircle className="w-4 h-4 text-ink-faint" strokeWidth={1.75} />
      </div>

      {performance.totalAttempts === 0 ? (
        <p className="text-sm text-ink-muted">No quizzes taken yet.</p>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-2xl font-medium text-ink">
              {performance.averageScore}%
            </span>
            <span className="text-xs text-ink-muted">
              average across {performance.totalAttempts} attempt{performance.totalAttempts === 1 ? "" : "s"}
            </span>
          </div>
          <ul className="space-y-2.5">
            {performance.recentAttempts.map((attempt) => {
              const percent = Math.round((attempt.score / attempt.total) * 100);
              return (
                <li key={attempt.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink truncate mr-2">{attempt.topicTitle}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={percent >= 70 ? "secondary" : "neutral"}>{percent}%</Badge>
                    <span className="text-xs text-ink-faint w-16 text-right">
                      {formatRelativeTime(attempt.completedAt)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Card>
  );
}
