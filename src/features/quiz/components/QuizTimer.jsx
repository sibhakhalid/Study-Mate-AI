import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatDuration(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/**
 * UI only, as specified — counts elapsed time for display and reports it
 * up (used later in the results summary). Does not enforce a limit or
 * auto-submit; that's a real product decision for later, not something
 * to invent silently here.
 */
export default function QuizTimer({ isRunning, onTick }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onTick]);

  return (
    <span className="flex items-center gap-1.5 text-sm text-ink-muted" aria-live="off">
      <Clock size={14} strokeWidth={1.75} />
      {formatDuration(seconds)}
    </span>
  );
}
