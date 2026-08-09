import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function FlashcardNavigation({ currentIndex, total, onPrevious, onNext }) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" icon={ChevronLeft} onClick={onPrevious} disabled={currentIndex === 0}>
        Previous
      </Button>
      <Button
        variant="ghost"
        icon={ChevronRight}
        iconPosition="right"
        onClick={onNext}
        disabled={currentIndex === total - 1}
      >
        Next
      </Button>
    </div>
  );
}
