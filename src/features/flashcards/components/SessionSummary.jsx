import { motion } from "framer-motion";
import { Sparkles, RotateCw, ListRestart, LayoutDashboard } from "lucide-react";
import ProgressRing from "../../../components/ui/ProgressRing";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

function getMessage(percent) {
  if (percent >= 90) return "Excellent recall!";
  if (percent >= 70) return "Great progress on this deck.";
  if (percent >= 50) return "Getting there — a bit more review will help.";
  return "Worth another pass through this deck.";
}

export default function SessionSummary({
  knownCount,
  reviewCount,
  total,
  onReviewMissed,
  onStudyAgain,
  onBackToDecks,
}) {
  const percent = Math.round((knownCount / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-md mx-auto text-center"
    >
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-soft mb-4">
        <Sparkles className="w-6 h-6 text-accent-hover" strokeWidth={1.75} />
      </span>
      <h1 className="font-display text-2xl font-medium text-ink mb-1.5">Session complete</h1>
      <p className="text-sm text-ink-muted mb-8">{getMessage(percent)}</p>

      <Card variant="default" className="mb-6">
        <div className="flex items-center justify-center mb-5">
          <ProgressRing
            percent={percent}
            size={120}
            strokeWidth={9}
            progressClassName="text-secondary"
          >
            <p className="font-display text-2xl font-medium text-ink">{percent}%</p>
          </ProgressRing>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-background rounded-xl py-3">
            <p className="font-display text-lg font-medium text-ink">{knownCount}</p>
            <p className="text-xs text-ink-muted mt-0.5">Known</p>
          </div>
          <div className="bg-background rounded-xl py-3">
            <p className="font-display text-lg font-medium text-ink">{reviewCount}</p>
            <p className="text-xs text-ink-muted mt-0.5">Needs review</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-2.5">
        {reviewCount > 0 && (
          <Button variant="secondary" icon={ListRestart} className="flex-1" onClick={onReviewMissed}>
            Review missed cards
          </Button>
        )}
        <Button variant="secondary" icon={RotateCw} className="flex-1" onClick={onStudyAgain}>
          Study again
        </Button>
        <Button variant="ghost" icon={LayoutDashboard} onClick={onBackToDecks}>
          Decks
        </Button>
      </div>
    </motion.div>
  );
}
