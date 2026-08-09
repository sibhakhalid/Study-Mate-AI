import { motion } from "framer-motion";
import Card from "../../../components/ui/Card";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

export default function StudyGoalsWidget({ goals }) {
  return (
    <Card variant="default">
      <h3 className="font-display text-base font-medium text-ink mb-4">
        This week's goals
      </h3>
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="space-y-4"
      >
        {goals.map((goal) => (
          <motion.li key={goal.id} variants={fadeInUp}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-ink">{goal.label}</span>
              <span className="text-xs text-ink-faint">{goal.progress}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${goal.progress}%` }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-secondary rounded-full"
              />
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </Card>
  );
}
