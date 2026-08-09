import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";

export default function PreferencesSection({ preferences, onSave }) {
  const [dailyGoal, setDailyGoal] = useState(preferences.dailyGoalMinutes);
  const [weekStart, setWeekStart] = useState(preferences.weekStartsOn);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDailyGoal(preferences.dailyGoalMinutes);
    setWeekStart(preferences.weekStartsOn);
  }, [preferences]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave({ dailyGoalMinutes: Number(dailyGoal), weekStartsOn: weekStart });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (err) {
      setError(err.message || "Couldn't save your preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card variant="default">
      <h2 className="font-display text-lg font-medium text-ink mb-5">Preferences</h2>

      <div className="space-y-5 max-w-md">
        <div>
          <p className="text-sm font-medium text-ink mb-2">Theme</p>
          <div className="flex gap-2">
            {["Light", "Dark"].map((option) => {
              const isDark = option === "Dark";
              return (
                <button
                  key={option}
                  type="button"
                  disabled={isDark}
                  title={isDark ? "Dark theme is coming in a future update" : undefined}
                  className={cn(
                    "flex-1 py-2 rounded-xl border text-sm font-medium transition-colors",
                    !isDark && "border-primary bg-primary-soft text-ink",
                    isDark && "border-border text-ink-faint cursor-not-allowed"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-ink-faint mt-1.5">Dark theme is coming in a future update.</p>
        </div>

        <Input
          label="Daily study goal (minutes)"
          type="number"
          min="0"
          value={dailyGoal}
          onChange={(e) => setDailyGoal(e.target.value)}
        />

        <div>
          <p className="text-sm font-medium text-ink mb-2">Week starts on</p>
          <div className="flex gap-2">
            {["sunday", "monday"].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setWeekStart(day)}
                className={cn(
                  "flex-1 py-2 rounded-xl border text-sm font-medium capitalize transition-colors",
                  weekStart === day
                    ? "border-primary bg-primary-soft text-ink"
                    : "border-border text-ink-muted hover:border-primary/40"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mt-4 max-w-md"
        >
          <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 mt-5">
        <Button variant="primary" loading={saving} onClick={handleSave}>
          {saving ? "Saving..." : "Save preferences"}
        </Button>
        {savedFlash && <span className="text-sm text-secondary-hover">Saved</span>}
      </div>
    </Card>
  );
}
