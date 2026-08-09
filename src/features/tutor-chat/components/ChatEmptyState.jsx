import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import SuggestedPrompts from "./SuggestedPrompts";
import { suggestedPrompts } from "../data/suggestedPrompts";

export default function ChatEmptyState({ onSelectPrompt }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center h-full py-10 px-4"
    >
      <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-soft mb-5 animate-floatSlow">
        <Bot className="w-7 h-7 text-primary-hover" strokeWidth={1.75} />
      </span>
      <h2 className="font-display text-xl font-medium text-ink mb-1.5">
        What are you studying today?
      </h2>
      <p className="text-sm text-ink-muted max-w-xs mb-7">
        Ask me anything about your material, or start with one of these.
      </p>
      <SuggestedPrompts prompts={suggestedPrompts} onSelect={onSelectPrompt} />
    </motion.div>
  );
}
