import { motion, useReducedMotion } from "framer-motion";
import { RotateCw } from "lucide-react";

/**
 * Classic 3D flip via rotateY on a perspective container, front/back
 * faces absolutely stacked with backface-visibility hidden. Fully
 * keyboard-operable (real button, Enter/Space flips) and screen readers
 * get the currently-visible side via a live region, since a screen
 * reader has no concept of "which face is toward the viewer."
 */
export default function FlashcardView({ front, back, flipped, onFlip }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="[perspective:1200px]">
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={flipped ? "Showing answer. Press to show question." : "Showing question. Press to show answer."}
        className="relative w-full h-72 sm:h-80 [transform-style:preserve-3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
      >
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          animate={{ rotateY: shouldReduceMotion ? 0 : flipped ? 180 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeInOut" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 [backface-visibility:hidden] bg-surface border border-border rounded-2xl shadow-lift flex flex-col items-center justify-center text-center p-8"
            style={shouldReduceMotion && flipped ? { display: "none" } : undefined}
          >
            <p className="text-xs font-medium text-ink-faint mb-4">Question</p>
            <p className="font-display text-xl text-ink leading-snug">{front}</p>
            <span className="flex items-center gap-1.5 text-xs text-ink-faint mt-6">
              <RotateCw size={12} strokeWidth={1.75} />
              Tap to flip
            </span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary-soft border border-primary/30 rounded-2xl shadow-lift flex flex-col items-center justify-center text-center p-8"
            style={shouldReduceMotion && !flipped ? { display: "none" } : undefined}
          >
            <p className="text-xs font-medium text-ink-faint mb-4">Answer</p>
            <p className="font-display text-xl text-ink leading-snug">{back}</p>
            <span className="flex items-center gap-1.5 text-xs text-ink-faint mt-6">
              <RotateCw size={12} strokeWidth={1.75} />
              Tap to flip back
            </span>
          </div>
        </motion.div>
      </button>

      <span className="sr-only" aria-live="polite">
        {flipped ? `Answer: ${back}` : `Question: ${front}`}
      </span>
    </div>
  );
}
