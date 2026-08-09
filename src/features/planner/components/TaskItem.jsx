import { motion } from "framer-motion";
import { Clock, AlertCircle, Pencil, Trash2 } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import { cn } from "../../../utils/cn";
import { getSubject } from "../data/subjects";

function formatTime(time) {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete, compact = false }) {
  const subject = getSubject(task.subjectId);
  const isDeadline = task.type === "deadline";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex items-start gap-3 bg-surface border border-border rounded-xl px-3.5 py-3 transition-colors hover:border-primary/30",
        task.completed && "opacity-60"
      )}
    >
      <button
        onClick={() => onToggleComplete(task.id)}
        aria-label={task.completed ? "Mark as not done" : "Mark as done"}
        aria-pressed={task.completed}
        className={cn(
          "shrink-0 w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-colors",
          task.completed ? "bg-secondary border-secondary" : "border-border hover:border-primary"
        )}
      >
        {task.completed && <span className="w-2 h-2 rounded-sm bg-surface" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm text-ink", task.completed && "line-through")}>
          {task.title}
        </p>
        <div className="flex items-center flex-wrap gap-2 mt-1.5">
          <Badge variant={subject.badgeVariant}>{subject.label}</Badge>
          {isDeadline && (
            <Badge variant="neutral" icon={AlertCircle}>Deadline</Badge>
          )}
          {task.startTime && !compact && (
            <span className="flex items-center gap-1 text-xs text-ink-faint">
              <Clock size={11} strokeWidth={1.75} />
              {formatTime(task.startTime)}
            </span>
          )}
        </div>
      </div>

      {!compact && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(task)}
            aria-label={`Edit task: ${task.title}`}
            className="p-1.5 rounded-lg text-ink-faint hover:bg-primary-soft/60 hover:text-ink transition-colors"
          >
            <Pencil size={14} strokeWidth={1.75} />
          </button>
          <button
            onClick={() => onDelete(task)}
            aria-label={`Delete task: ${task.title}`}
            className="p-1.5 rounded-lg text-ink-faint hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
