import { motion } from "framer-motion";
import { Trophy, RotateCw, ListChecks, LayoutDashboard } from "lucide-react";
import ProgressRing from "../../../components/ui/ProgressRing";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

function formatDuration(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}m ${secs}s`;
}

function getMessage(percent) {
  if (percent >= 90) return "Outstanding work!";
  if (percent >= 70) return "Nice work — solid understanding.";
  if (percent >= 50) return "Good effort — a bit more review will help.";
  return "Worth another pass through this material.";
}

export default function QuizCompletionScreen({
  score,
  total,
  timeTakenSeconds,
  onReview,
  onRetake,
  onBackToDashboard,
}) {
  const percent = Math.round((score / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-md mx-auto text-center"
    >
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-soft mb-4">
        <Trophy className="w-6 h-6 text-accent-hover" strokeWidth={1.75} />
      </span>
      <h1 className="font-display text-2xl font-medium text-ink mb-1.5">Quiz complete</h1>
      <p className="text-sm text-ink-muted mb-8">{getMessage(percent)}</p>

      <Card variant="default" className="mb-6">
        <div className="flex items-center justify-center mb-5">
          <ProgressRing percent={percent} size={120} strokeWidth={9}>
            <div className="text-center">
              <p className="font-display text-2xl font-medium text-ink">{percent}%</p>
            </div>
          </ProgressRing>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-background rounded-xl py-3">
            <p className="font-display text-lg font-medium text-ink">
              {score}/{total}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">Correct answers</p>
          </div>
          <div className="bg-background rounded-xl py-3">
            <p className="font-display text-lg font-medium text-ink">
              {formatDuration(timeTakenSeconds)}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">Time taken</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <Button variant="secondary" icon={ListChecks} className="flex-1" onClick={onReview}>
          Review answers
        </Button>
        <Button variant="secondary" icon={RotateCw} className="flex-1" onClick={onRetake}>
          Retake quiz
        </Button>
        <Button variant="ghost" icon={LayoutDashboard} onClick={onBackToDashboard}>
          Dashboard
        </Button>
      </div>
    </motion.div>
  );
}
