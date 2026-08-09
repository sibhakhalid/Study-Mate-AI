import { motion } from "framer-motion";
import { TrendingUp, AlertCircle } from "lucide-react";
import Button from "../../../components/ui/Button";

export function ProgressLoadingState() {
  return (
    <div className="grid lg:grid-cols-3 gap-4" aria-busy="true" aria-label="Loading progress">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-32 bg-surface border border-border rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

export function ProgressErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="alert"
      className="flex flex-col items-center justify-center text-center py-20 px-6 bg-surface rounded-2xl border border-red-200"
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" strokeWidth={1.75} />
      </span>
      <h3 className="font-display text-lg font-medium text-ink mb-1.5">
        Couldn't load your progress
      </h3>
      <p className="text-sm text-ink-muted max-w-xs mb-6">{message}</p>
      <Button variant="secondary" onClick={onRetry}>Try again</Button>
    </motion.div>
  );
}

export function ProgressEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6 bg-surface rounded-2xl border border-border border-dashed"
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft mb-4">
        <TrendingUp className="w-6 h-6 text-primary-hover" strokeWidth={1.75} />
      </span>
      <h3 className="font-display text-lg font-medium text-ink mb-1.5">Nothing to show yet</h3>
      <p className="text-sm text-ink-muted max-w-xs">
        Complete a task, take a quiz, or study a flashcard deck to see your progress here.
      </p>
    </motion.div>
  );
}
