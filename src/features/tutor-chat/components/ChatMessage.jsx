import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "../../../utils/cn";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <span
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
          isUser ? "bg-secondary-soft" : "bg-primary-soft"
        )}
        aria-hidden="true"
      >
        {isUser ? (
          <User className="w-4 h-4 text-secondary-hover" strokeWidth={1.75} />
        ) : (
          <Bot className="w-4 h-4 text-primary-hover" strokeWidth={1.75} />
        )}
      </span>

      <div
        className={cn(
          "max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
          isUser
            ? "bg-primary text-ink rounded-tr-sm"
            : "bg-surface border border-border text-ink rounded-tl-sm"
        )}
      >
        {content}
      </div>
    </motion.div>
  );
}
