import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "../../../utils/cn";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2.5 bg-surface border border-border rounded-2xl p-2.5 shadow-soft"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
        placeholder="Ask the AI Tutor anything..."
        aria-label="Message the AI Tutor"
        className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none disabled:opacity-60 max-h-40"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          value.trim() && !disabled
            ? "bg-primary hover:bg-primary-hover text-ink"
            : "bg-border text-ink-faint cursor-not-allowed"
        )}
      >
        <Send size={16} strokeWidth={1.75} />
      </button>
    </form>
  );
}
