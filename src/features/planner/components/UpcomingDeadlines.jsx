import { AlertCircle } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { getSubject } from "../data/subjects";

export default function UpcomingDeadlines({ tasks }) {
  const upcoming = tasks
    .filter((t) => t.type === "deadline" && !t.completed)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <Card variant="default">
      <h3 className="font-display text-base font-medium text-ink mb-4">
        Upcoming deadlines
      </h3>
      {upcoming.length === 0 ? (
        <p className="text-sm text-ink-muted">No deadlines coming up.</p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((task) => {
            const subject = getSubject(task.subjectId);
            return (
              <li key={task.id} className="flex items-start gap-2.5">
                <AlertCircle size={15} strokeWidth={1.75} className="text-accent-hover shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm text-ink truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={subject.badgeVariant}>{subject.label}</Badge>
                    <span className="text-xs text-ink-faint">
                      {new Date(task.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
