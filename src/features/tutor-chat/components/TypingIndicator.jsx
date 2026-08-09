import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const dotTransition = (delay) => ({
  duration: 1.1,
  repeat: Infinity,
  ease: "easeInOut",
  delay,
});

export default function TypingIndicator() {
  return (
    <div className="flex gap-3" role="status" aria-label="AI Tutor is typing">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-soft shrink-0">
        <Bot className="w-4 h-4 text-primary-hover" strokeWidth={1.75} />
      </span>
      <div className="flex items-center gap-1.5 bg-surface border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        {[0, 0.15, 0.3].map((delay) => (
          <motion.span
            key={delay}
            className="w-1.5 h-1.5 rounded-full bg-ink-faint"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={dotTransition(delay)}
          />
        ))}
      </div>
    </div>
  );
}
