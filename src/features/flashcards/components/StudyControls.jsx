import { Check, RotateCcw } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function StudyControls({ onMarkKnown, onMarkNeedsReview }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="secondary" icon={RotateCcw} onClick={onMarkNeedsReview}>
        Needs review
      </Button>
      <Button variant="primary" icon={Check} onClick={onMarkKnown}>
        I know this
      </Button>
    </div>
  );
}
