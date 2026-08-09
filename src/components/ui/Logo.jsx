import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Brand mark used in the Sidebar today, reusable anywhere else later
 * (landing page navbar, auth screens, etc).
 *
 * Motion intent: calm and intelligent, not playful.
 * - Idle: a very slow, tiny vertical drift — like something quietly
 *   alive, not "look at me" motion.
 * - Hover: a small lift + scale, communicating responsiveness without
 *   any bounce or spring overshoot (tween + easeOut only).
 * - No rotation, no opacity flashing, no elastic/spring easing anywhere.
 * - Fully disabled for prefers-reduced-motion — falls back to a static
 *   mark, no exceptions.
 */
const markVariants = {
  float: {
    y: [0, -3, 0],
    scale: 1,
    transition: {
      y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
    },
  },
  hover: {
    y: -2,
    scale: 1.06,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function Logo({ showWordmark = true, className }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.span
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-soft"
        variants={shouldReduceMotion ? undefined : markVariants}
        animate={shouldReduceMotion ? undefined : "float"}
        whileHover={shouldReduceMotion ? undefined : "hover"}
        style={{ transformOrigin: "center" }}
      >
        <GraduationCap
          className="w-[18px] h-[18px] text-primary-hover"
          strokeWidth={1.75}
        />
      </motion.span>

      {showWordmark && (
        <span className="font-display font-medium text-[17px] text-ink">
          StudyMate AI
        </span>
      )}
    </div>
  );
}
