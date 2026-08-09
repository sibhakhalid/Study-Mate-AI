import Card from "../../../components/ui/Card";
import ProgressRing from "../../../components/ui/ProgressRing";
import { getWeekDays } from "../utils/dateHelpers";
import { dateKey } from "../utils/dateHelpers";

export default function ProgressSummary({ tasks }) {
  const weekDayKeys = getWeekDays(new Date()).map(dateKey);
  const thisWeekTasks = tasks.filter((t) => weekDayKeys.includes(t.date) && t.type === "study");
  const completed = thisWeekTasks.filter((t) => t.completed).length;
  const total = thisWeekTasks.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card variant="default" className="flex items-center gap-4">
      <ProgressRing percent={percent} size={72} strokeWidth={6}>
        <span className="font-display text-sm font-medium text-ink">{percent}%</span>
      </ProgressRing>
      <div>
        <h3 className="text-sm font-medium text-ink mb-0.5">This week</h3>
        <p className="text-xs text-ink-muted">
          {completed} of {total} study tasks completed
        </p>
      </div>
    </Card>
  );
}
