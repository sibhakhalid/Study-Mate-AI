import { motion } from "framer-motion";
import { HelpCircle, AlertCircle, Sparkles } from "lucide-react";
import Button from "../../../components/ui/Button";

export function QuizEmptyState({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6 bg-surface rounded-2xl border border-border border-dashed"
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft mb-4">
        <HelpCircle className="w-6 h-6 text-primary-hover" strokeWidth={1.75} />
      </span>
      <h3 className="font-display text-lg font-medium text-ink mb-1.5">No quizzes yet</h3>
      <p className="text-sm text-ink-muted max-w-xs mb-6">
        Generate your first quiz from a topic and start testing yourself.
      </p>
      <Button variant="primary" icon={Sparkles} onClick={onStart}>
        Start a quiz
      </Button>
    </motion.div>
  );
}

export function QuizGeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <motion.span
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-5"
      >
        <Sparkles className="w-7 h-7 text-ink" strokeWidth={1.75} />
      </motion.span>
      <h3 className="font-display text-lg font-medium text-ink mb-1.5">
        Generating your quiz...
      </h3>
      <p className="text-sm text-ink-muted">This usually takes just a moment.</p>
    </div>
  );
}

export function QuizErrorState({ message, onRetry }) {
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
        Something went wrong
      </h3>
      <p className="text-sm text-ink-muted max-w-xs mb-6">{message}</p>
      <Button variant="secondary" onClick={onRetry}>Try again</Button>
    </motion.div>
  );
}
