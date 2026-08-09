import { motion } from "framer-motion";
import { Layers, AlertCircle } from "lucide-react";
import Button from "../../../components/ui/Button";

export function FlashcardsEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6 bg-surface rounded-2xl border border-border border-dashed"
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft mb-4">
        <Layers className="w-6 h-6 text-primary-hover" strokeWidth={1.75} />
      </span>
      <h3 className="font-display text-lg font-medium text-ink mb-1.5">No decks yet</h3>
      <p className="text-sm text-ink-muted max-w-xs">
        Decks will appear here once notes can be turned into flashcards.
      </p>
    </motion.div>
  );
}

export function FlashcardsLoadingState() {
  return (
    <div
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-busy="true"
      aria-label="Loading decks"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-2xl p-6 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-border mb-4" />
          <div className="h-4 bg-border rounded-full w-2/3 mb-2" />
          <div className="h-3 bg-border rounded-full w-full mb-1" />
          <div className="h-3 bg-border rounded-full w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function FlashcardsErrorState({ message, onRetry }) {
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
      <h3 className="font-display text-lg font-medium text-ink mb-1.5">Something went wrong</h3>
      <p className="text-sm text-ink-muted max-w-xs mb-6">{message}</p>
      <Button variant="secondary" onClick={onRetry}>Try again</Button>
    </motion.div>
  );
}
