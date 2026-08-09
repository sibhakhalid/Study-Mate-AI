import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * Circular progress indicator. Reusable anywhere a "percent complete"
 * needs a calmer, less clinical treatment than a bar — today's Daily
 * Progress widget, later the Progress-tracking feature.
 *
 * percent: 0-100. size/strokeWidth are pixel values.
 * children: rendered centered inside the ring (e.g. "65%" or an icon).
 */
export default function ProgressRing({
  percent = 0,
  size = 96,
  strokeWidth = 8,
  trackClassName = "text-border",
  progressClassName = "text-primary",
  children,
  className,
}) {
  const shouldReduceMotion = useReducedMotion();
  const clipId = useId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={trackClassName}
          stroke="currentColor"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          className={progressClassName}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.8, ease: "easeOut" }
          }
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
