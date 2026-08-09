import { motion } from "framer-motion";
import { Flame, Clock, Layers, HelpCircle } from "lucide-react";
import Card from "../../../components/ui/Card";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

const STAT_CONFIG = [
  { key: "streakDays", icon: Flame, label: "Day streak", suffix: "" },
  { key: "hoursThisWeek", icon: Clock, label: "Hours this week", suffix: "h" },
  { key: "cardsReviewed", icon: Layers, label: "Cards reviewed", suffix: "" },
  { key: "quizzesTaken", icon: HelpCircle, label: "Quizzes taken", suffix: "" },
];

export default function StudyOverview({ data }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      {STAT_CONFIG.map((stat) => (
        <motion.div key={stat.key} variants={fadeInUp}>
          <Card variant="default" className="p-4 sm:p-5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary-soft mb-3">
              <stat.icon className="w-[18px] h-[18px] text-primary-hover" strokeWidth={1.75} />
            </span>
            <p className="font-display text-2xl font-medium text-ink">
              {data[stat.key]}
              {stat.suffix}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">{stat.label}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
