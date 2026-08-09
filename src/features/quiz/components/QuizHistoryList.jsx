import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

export default function QuizHistoryList({ attempts }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {attempts.map((attempt) => {
        const percent = Math.round((attempt.score / attempt.total) * 100);
        return (
          <motion.div key={attempt.id} variants={fadeInUp}>
            <Card variant="default">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-ink">{attempt.topicTitle}</h3>
                <Badge variant={percent >= 70 ? "secondary" : "neutral"} icon={CheckCircle2}>
                  {percent}%
                </Badge>
              </div>
              <p className="text-xs text-ink-muted">
                {attempt.score}/{attempt.total} correct
              </p>
              <p className="text-xs text-ink-faint mt-1">
                {formatRelativeTime(attempt.completedAt)}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
