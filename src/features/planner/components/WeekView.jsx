import TaskItem from "./TaskItem";
import { dateKey, isToday } from "../utils/dateHelpers";
import { cn } from "../../../utils/cn";

export default function WeekView({ weekDays, tasksByDate, onSelectDay, onToggleComplete, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
      {weekDays.map((day) => {
        const key = dateKey(day);
        const dayTasks = tasksByDate[key] ?? [];
        return (
          <div key={key} className="min-w-0">
            <button
              onClick={() => onSelectDay(day)}
              className={cn(
                "w-full text-left px-2 py-1.5 rounded-lg mb-2 transition-colors",
                isToday(day) ? "bg-primary-soft" : "hover:bg-primary-soft/40"
              )}
            >
              <p className="text-xs font-medium text-ink-muted">
                {day.toLocaleDateString(undefined, { weekday: "short" })}
              </p>
              <p className="font-display text-sm font-medium text-ink">
                {day.getDate()}
              </p>
            </button>

            <div className="space-y-2">
              {dayTasks.length === 0 ? (
                <p className="text-xs text-ink-faint px-1">No tasks</p>
              ) : (
                dayTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    compact
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
