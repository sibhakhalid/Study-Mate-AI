import { dateKey, isToday } from "../utils/dateHelpers";
import { cn } from "../../../utils/cn";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthView({ monthGrid, currentMonth, tasksByDate, selectedDate, onSelectDay }) {
  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-ink-faint py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {monthGrid.flat().map((day) => {
          const key = dateKey(day);
          const dayTasks = tasksByDate[key] ?? [];
          const inCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isSelected = dateKey(day) === dateKey(selectedDate);

          return (
            <button
              key={key}
              onClick={() => onSelectDay(day)}
              aria-label={`${day.toLocaleDateString(undefined, { month: "long", day: "numeric" })}, ${dayTasks.length} task${dayTasks.length === 1 ? "" : "s"}`}
              className={cn(
                "flex flex-col items-center gap-1 py-2 rounded-xl text-sm transition-colors min-h-[56px]",
                !inCurrentMonth && "text-ink-faint",
                inCurrentMonth && "text-ink",
                isSelected && "bg-primary-soft",
                !isSelected && "hover:bg-primary-soft/40",
                isToday(day) && !isSelected && "ring-1 ring-primary/40"
              )}
            >
              <span className="font-medium">{day.getDate()}</span>
              {dayTasks.length > 0 && (
                <span className="flex gap-0.5">
                  {dayTasks.slice(0, 3).map((task) => (
                    <span
                      key={task.id}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        task.type === "deadline" ? "bg-accent-hover" : "bg-primary-hover"
                      )}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
