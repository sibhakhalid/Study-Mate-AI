import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Card from "../../../components/ui/Card";
import { cn } from "../../../utils/cn";

/**
 * Two modes, one component — avoids a near-duplicate "ReviewQuestionCard":
 * - "active": options are clickable, only the selected one is highlighted
 * - "review": all options are static, correct answer is marked green and
 *   an incorrect selection (if any) is marked red, explanation is shown
 */
export default function QuestionCard({
  question,
  index,
  total,
  selectedIndex,
  onSelect,
  mode = "active",
}) {
  const isReview = mode === "review";

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card variant="default">
        <p className="text-xs font-medium text-ink-faint mb-2">
          Question {index + 1} of {total}
        </p>
        <h2 className="font-display text-lg font-medium text-ink mb-5 leading-snug">
          {question.question}
        </h2>

        <div className="space-y-2.5" role={isReview ? undefined : "radiogroup"} aria-label="Answer options">
          {question.options.map((option, i) => {
            const isSelected = selectedIndex === i;
            const isCorrectOption = i === question.correctIndex;

            let stateClasses = "border-border hover:border-primary/40 hover:bg-primary-soft/30";
            let icon = null;

            if (isReview) {
              if (isCorrectOption) {
                stateClasses = "border-secondary bg-secondary-soft";
                icon = <Check size={16} strokeWidth={2.5} className="text-secondary-hover" />;
              } else if (isSelected && !isCorrectOption) {
                stateClasses = "border-red-300 bg-red-50";
                icon = <X size={16} strokeWidth={2.5} className="text-red-500" />;
              }
            } else if (isSelected) {
              stateClasses = "border-primary bg-primary-soft";
            }

            return (
              <button
                key={i}
                type="button"
                role={isReview ? undefined : "radio"}
                aria-checked={isReview ? undefined : isSelected}
                disabled={isReview}
                onClick={() => onSelect?.(i)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 text-left px-4 py-3 rounded-xl border text-sm text-ink transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                  stateClasses,
                  isReview && "cursor-default"
                )}
              >
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {isReview && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-ink-faint mb-1">Explanation</p>
            <p className="text-sm text-ink-muted leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
