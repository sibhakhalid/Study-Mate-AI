import { useState } from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import Button from "../../../components/ui/Button";

/**
 * Shown only for an existing, saved note (a new draft has nothing for
 * Gemini to summarize yet). Summarizing is opt-in rather than automatic
 * on every save — running an AI call on every keystroke-triggered save
 * would be wasteful and slow the save flow down for no benefit.
 */
export default function NoteSummaryPanel({ note, onSummarize }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSummarize() {
    setLoading(true);
    setError(null);
    try {
      await onSummarize(note.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-primary-soft/40 border border-border rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} strokeWidth={1.75} className="text-ink" />
          <h2 className="font-display text-sm font-medium text-ink">AI Summary</h2>
        </div>
        <Button variant="secondary" icon={Sparkles} loading={loading} onClick={handleSummarize}>
          {loading ? "Summarizing..." : note.summary ? "Regenerate" : "Summarize"}
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
        >
          <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
          {error}
        </div>
      )}

      {note.summary ? (
        <div className="space-y-3">
          <p className="text-sm text-ink leading-relaxed">{note.summary}</p>
          {note.summaryKeyPoints?.length > 0 && (
            <ul className="space-y-1.5">
              {note.summaryKeyPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-muted">
                  <span className="text-ink-faint mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        !loading && (
          <p className="text-sm text-ink-muted">
            Get a quick AI-generated summary and key points for this note.
          </p>
        )
      )}
    </div>
  );
}
