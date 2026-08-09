import { ArrowLeft } from "lucide-react";
import Button from "../../../components/ui/Button";
import QuestionCard from "./QuestionCard";

export default function AnswerReviewList({ questions, answers, onBack }) {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
        Back to results
      </Button>

      <div className="space-y-4">
        {questions.map((question, i) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={i}
            total={questions.length}
            selectedIndex={answers[i]}
            mode="review"
          />
        ))}
      </div>
    </div>
  );
}
