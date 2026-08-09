import Card from "../../../components/ui/Card";
import ProgressRing from "../../../components/ui/ProgressRing";

export default function DailyProgress({ data }) {
  const remaining = Math.max(0, data.goalMinutes - data.minutesStudied);

  return (
    <Card variant="default" className="flex items-center gap-5">
      <ProgressRing percent={data.percent} size={88} strokeWidth={7}>
        <span className="font-display text-lg font-medium text-ink">
          {data.percent}%
        </span>
      </ProgressRing>
      <div>
        <h3 className="font-display text-base font-medium text-ink mb-1">
          Today's goal
        </h3>
        <p className="text-sm text-ink-muted">
          {data.minutesStudied} of {data.goalMinutes} minutes studied
        </p>
        <p className="text-xs text-ink-faint mt-1">
          {remaining > 0 ? `${remaining} minutes to go` : "Goal reached — nice work"}
        </p>
      </div>
    </Card>
  );
}
