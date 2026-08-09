import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

export default function SuggestedPrompts({ prompts, onSelect }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      viewport={viewportOnce}
      className="grid sm:grid-cols-2 gap-2.5 w-full max-w-lg"
    >
      {prompts.map((prompt) => (
        <motion.button
          key={prompt}
          variants={fadeInUp}
          onClick={() => onSelect(prompt)}
          className="flex items-start gap-2.5 text-left bg-surface border border-border rounded-xl px-3.5 py-3 text-sm text-ink-muted hover:text-ink hover:border-primary/40 hover:shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Sparkles size={14} strokeWidth={1.75} className="shrink-0 mt-0.5 text-primary-hover" />
          {prompt}
        </motion.button>
      ))}
    </motion.div>
  );
}
