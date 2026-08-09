import { Clock, CheckCircle2 } from "lucide-react";
import Card from "../../../components/ui/Card";
import { cn } from "../../../utils/cn";

const PERIODS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

function formatMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export default function StatsOverviewGrid({ period, onPeriodChange, stats }) {
  return (
    <div className="space-y-3">
      <div
        role="group"
        aria-label="Time period"
        className="flex items-center bg-surface border border-border rounded-xl p-1 w-fit"
      >
        {PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => onPeriodChange(p.id)}
            aria-pressed={period === p.id}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              period === p.id ? "bg-primary-soft text-ink" : "text-ink-muted hover:text-ink"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card variant="default">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary-soft mb-3">
            <Clock className="w-[18px] h-[18px] text-primary-hover" strokeWidth={1.75} />
          </span>
          <p className="font-display text-2xl font-medium text-ink">
            {formatMinutes(stats.studyMinutes)}
          </p>
          <p className="text-xs text-ink-muted mt-0.5">Study time</p>
        </Card>
        <Card variant="default">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-secondary-soft mb-3">
            <CheckCircle2 className="w-[18px] h-[18px] text-secondary-hover" strokeWidth={1.75} />
          </span>
          <p className="font-display text-2xl font-medium text-ink">{stats.tasksCompleted}</p>
          <p className="text-xs text-ink-muted mt-0.5">Tasks completed</p>
        </Card>
      </div>
    </div>
  );
}
