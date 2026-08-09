import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";
import { formatDayLabel, formatWeekRangeLabel, formatMonthYear } from "../utils/dateHelpers";

const VIEWS = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

function getPeriodLabel(view, date) {
  if (view === "day") return formatDayLabel(date);
  if (view === "week") return formatWeekRangeLabel(date);
  return formatMonthYear(date);
}

export default function PlannerToolbar({ view, onViewChange, selectedDate, onNavigate, onToday, onNewTask }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div
        role="group"
        aria-label="Planner view"
        className="flex items-center bg-surface border border-border rounded-xl p-1 w-fit"
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            aria-pressed={view === v.id}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              view === v.id ? "bg-primary-soft text-ink" : "text-ink-muted hover:text-ink"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onNavigate(-1)}
          aria-label="Previous"
          className="p-1.5 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
        </button>
        <span className="text-sm font-medium text-ink min-w-[140px] text-center">
          {getPeriodLabel(view, selectedDate)}
        </span>
        <button
          onClick={() => onNavigate(1)}
          aria-label="Next"
          className="p-1.5 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors"
        >
          <ChevronRight size={16} strokeWidth={1.75} />
        </button>
        <button
          onClick={onToday}
          className="text-xs font-medium text-ink-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-primary-soft/60 transition-colors"
        >
          Today
        </button>
      </div>

      <Button variant="primary" icon={Plus} onClick={onNewTask} className="sm:ml-auto">
        New task
      </Button>
    </div>
  );
}
