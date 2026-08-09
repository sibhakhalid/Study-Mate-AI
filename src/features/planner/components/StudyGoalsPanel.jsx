import { useState } from "react";
import { Plus, Trash2, Target } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function StudyGoalsPanel({ goals, onAddGoal, onRemoveGoal }) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("hours");

  function handleAdd() {
    if (!label.trim() || !target) return;
    onAddGoal({ label: label.trim(), targetValue: Number(target), unit });
    setLabel("");
    setTarget("");
    setAdding(false);
  }

  return (
    <Card variant="default">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-medium text-ink">Study goals</h3>
        <button
          onClick={() => setAdding((v) => !v)}
          aria-label={adding ? "Cancel adding goal" : "Add a goal"}
          className="p-1.5 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors"
        >
          <Plus size={16} strokeWidth={1.75} className={adding ? "rotate-45 transition-transform" : "transition-transform"} />
        </button>
      </div>

      {adding && (
        <div className="space-y-2.5 mb-4 pb-4 border-b border-border">
          <Input
            placeholder="Goal, e.g. Study 10 hours"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                min="1"
                placeholder="Target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="bg-surface border border-border rounded-xl px-3 text-sm text-ink"
            >
              <option value="hours">hours</option>
              <option value="tasks">tasks</option>
            </select>
          </div>
          <Button variant="primary" size="sm" className="w-full" onClick={handleAdd}>
            Add goal
          </Button>
        </div>
      )}

      {goals.length === 0 ? (
        <p className="text-sm text-ink-muted">No goals set yet.</p>
      ) : (
        <ul className="space-y-4">
          {goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            return (
              <li key={goal.id} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-sm text-ink">
                    <Target size={13} strokeWidth={1.75} className="text-primary-hover shrink-0" />
                    {goal.label}
                  </span>
                  <button
                    onClick={() => onRemoveGoal(goal.id)}
                    aria-label={`Remove goal: ${goal.label}`}
                    className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 p-1 rounded-lg text-ink-faint hover:text-red-500 transition-opacity"
                  >
                    <Trash2 size={12} strokeWidth={1.75} />
                  </button>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-ink-faint mt-1">
                  {goal.currentValue}/{goal.targetValue} {goal.unit}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
