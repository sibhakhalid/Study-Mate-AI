import TaskItem from "./TaskItem";

export default function DayView({ tasks, onToggleComplete, onEdit, onDelete }) {
  const sorted = [...tasks].sort((a, b) => {
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return a.startTime.localeCompare(b.startTime);
  });

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 text-sm text-ink-muted bg-surface border border-border border-dashed rounded-2xl">
        Nothing scheduled for this day.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {sorted.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
