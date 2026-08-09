/**
 * Generic "X of N + percent" progress bar. Used by Quiz (QuizProgressBar)
 * and Flashcards study sessions — extracted here after noticing both
 * would otherwise be byte-for-byte duplicate implementations.
 */
export default function StepProgressBar({ current, total, itemLabel = "Item" }) {
  const percent = Math.round(((current + 1) / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-ink-muted">
          {itemLabel} {current + 1} of {total}
        </span>
        <span className="text-xs text-ink-faint">{percent}%</span>
      </div>
      <div
        className="h-1.5 bg-border rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${itemLabel} progress`}
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
