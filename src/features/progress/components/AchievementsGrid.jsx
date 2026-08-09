import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { cn } from "../../../utils/cn";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

export default function AchievementsGrid({ achievements }) {
  return (
    <div>
      <h3 className="font-display text-base font-medium text-ink mb-4">Achievements</h3>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            variants={fadeInUp}
            className={cn(
              "flex flex-col items-center text-center gap-2 rounded-2xl border p-4",
              achievement.unlocked
                ? "bg-accent-soft border-accent/40"
                : "bg-surface border-border opacity-60"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl",
                achievement.unlocked ? "bg-surface" : "bg-background"
              )}
            >
              {achievement.unlocked ? (
                <Award className="w-5 h-5 text-accent-hover" strokeWidth={1.75} />
              ) : (
                <Lock className="w-4 h-4 text-ink-faint" strokeWidth={1.75} />
              )}
            </span>
            <div>
              <p className="text-xs font-medium text-ink">{achievement.title}</p>
              <p className="text-[11px] text-ink-faint mt-0.5 leading-snug">
                {achievement.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
