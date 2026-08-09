import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function QuizNavigation({
  currentIndex,
  total,
  hasAnswer,
  onPrevious,
  onNext,
  onSubmit,
}) {
  const isLast = currentIndex === total - 1;

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        icon={ChevronLeft}
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        Previous
      </Button>

      {isLast ? (
        <Button
          variant="primary"
          icon={CheckCircle2}
          iconPosition="right"
          onClick={onSubmit}
          disabled={!hasAnswer}
        >
          Submit quiz
        </Button>
      ) : (
        <Button
          variant="primary"
          icon={ChevronRight}
          iconPosition="right"
          onClick={onNext}
          disabled={!hasAnswer}
        >
          Next
        </Button>
      )}
    </div>
  );
}
