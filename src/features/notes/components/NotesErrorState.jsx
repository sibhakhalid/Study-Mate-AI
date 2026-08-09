import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function NotesErrorState({ message, onRetry }) {
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
        Couldn't load your notes
      </h3>
      <p className="text-sm text-ink-muted max-w-xs mb-6">{message}</p>
      <Button variant="secondary" onClick={onRetry}>Try again</Button>
    </motion.div>
  );
}
