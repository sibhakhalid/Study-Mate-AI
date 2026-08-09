import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Card from "../../../components/ui/Card";
import Checkbox from "../../../components/ui/Checkbox";

const NOTIFICATION_ITEMS = [
  { key: "studyReminders", label: "Study reminders", description: "Nudges for tasks on your planner" },
  { key: "deadlineAlerts", label: "Deadline alerts", description: "Heads-up before a deadline is due" },
  { key: "weeklySummary", label: "Weekly summary", description: "A recap of your progress every week" },
  { key: "productUpdates", label: "Product updates", description: "News about new StudyMate AI features" },
];

/**
 * Each toggle saves independently on change — no separate "Save"
 * button, since a settings toggle list is expected to apply instantly
 * (matches how every OS/app notification settings screen behaves).
 */
export default function NotificationsSection({ notifications, onSave }) {
  const [pendingKey, setPendingKey] = useState(null);
  const [error, setError] = useState(null);

  async function handleToggle(key, value) {
    setPendingKey(key);
    setError(null);
    try {
      await onSave({ [key]: value });
    } catch (err) {
      // The checkbox's `checked` prop is driven by the parent's saved
      // state, so a failed save already makes it visually revert on
      // its own — but with no message, that revert just looks like the
      // toggle silently didn't work.
      setError(err.message || "Couldn't save that change. Please try again.");
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <Card variant="default">
      <h2 className="font-display text-lg font-medium text-ink mb-1.5">Notifications</h2>
      <p className="text-sm text-ink-muted mb-5">Changes save automatically.</p>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4 max-w-md"
        >
          <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
          {error}
        </div>
      )}

      <ul className="space-y-4 max-w-md">
        {NOTIFICATION_ITEMS.map((item) => (
          <li key={item.key} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-ink">{item.label}</p>
              <p className="text-xs text-ink-muted mt-0.5">{item.description}</p>
            </div>
            <Checkbox
              label=""
              aria-label={item.label}
              checked={notifications[item.key]}
              disabled={pendingKey === item.key}
              onChange={(e) => handleToggle(item.key, e.target.checked)}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
