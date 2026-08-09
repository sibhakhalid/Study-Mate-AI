import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import Card from "../../../components/ui/Card";

export default function StreakCard({ streak }) {
  return (
    <Card variant="feature" className="flex items-center gap-4">
      <motion.span
        animate={streak > 0 ? { scale: [1, 1.08, 1] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface shrink-0"
      >
        <Flame className="w-6 h-6 text-accent-hover" strokeWidth={1.75} />
      </motion.span>
      <div>
        <p className="font-display text-2xl font-medium text-ink">
          {streak} day{streak === 1 ? "" : "s"}
        </p>
        <p className="text-sm text-ink-muted">
          {streak === 0 ? "Complete a task today to start a streak" : "Current study streak"}
        </p>
      </div>
    </Card>
  );
}
