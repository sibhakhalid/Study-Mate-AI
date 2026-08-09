import StepProgressBar from "../../../components/ui/StepProgressBar";

export default function QuizProgressBar({ current, total }) {
  return <StepProgressBar current={current} total={total} itemLabel="Question" />;
}
