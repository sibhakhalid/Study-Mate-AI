import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, AlertCircle, Send } from "lucide-react";
import Card from "../../../components/ui/Card";
import * as studyAssistantService from "../services/studyAssistantService";

const USE_BACKEND = Boolean(import.meta.env.VITE_API_BASE_URL);

/**
 * Self-contained: unlike the rest of the dashboard (which reads mock
 * data handed down from DashboardPage), this widget owns its own
 * fetching — it's live AI data, not a placeholder waiting to be wired
 * up, so there's nothing for DashboardPage to pass down.
 */
export default function StudyAssistantWidget() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(USE_BACKEND);
  const [error, setError] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState(null);

  async function loadRecommendations() {
    setLoading(true);
    setError(null);
    try {
      const result = await studyAssistantService.getRecommendations();
      setRecommendations(result.recommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (USE_BACKEND) loadRecommendations();
  }, []);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    setAskError(null);
    try {
      const result = await studyAssistantService.ask(question.trim());
      setAnswer(result.answer);
      setQuestion("");
    } catch (err) {
      setAskError(err.message);
    } finally {
      setAsking(false);
    }
  }

  return (
    <Card variant="default">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} strokeWidth={1.75} className="text-ink" />
          <h2 className="font-display text-base font-medium text-ink">Study Assistant</h2>
        </div>
        {USE_BACKEND && (
          <button
            onClick={loadRecommendations}
            disabled={loading}
            aria-label="Refresh recommendations"
            className="p-1.5 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} strokeWidth={1.75} className={loading ? "animate-spin" : ""} />
          </button>
        )}
      </div>

      {!USE_BACKEND ? (
        <p className="text-sm text-ink-muted">
          Connect a backend (set <code className="text-xs">VITE_API_BASE_URL</code>) to get
          personalized study recommendations and quick answers here.
        </p>
      ) : (
        <>
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4"
            >
              <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 rounded-xl bg-primary-soft/40 animate-pulse" />
              ))}
            </div>
          ) : (
            recommendations.length > 0 && (
              <ul className="space-y-2.5 mb-5">
                {recommendations.map((rec, i) => (
                  <li key={i} className="rounded-xl border border-border px-3.5 py-2.5">
                    <p className="text-sm font-medium text-ink">{rec.title}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{rec.detail}</p>
                  </li>
                ))}
              </ul>
            )
          )}

          <form onSubmit={handleAsk} className="flex items-center gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a quick study question..."
              className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            />
            <button
              type="submit"
              disabled={asking || !question.trim()}
              aria-label="Ask"
              className="p-2 rounded-xl bg-primary text-ink hover:bg-primary-hover transition-colors disabled:opacity-50 shrink-0"
            >
              <Send size={15} strokeWidth={1.75} />
            </button>
          </form>

          {askError && (
            <p className="text-sm text-red-600 mt-2.5">{askError}</p>
          )}
          {answer && (
            <p className="text-sm text-ink-muted mt-3 leading-relaxed border-t border-border pt-3">
              {answer}
            </p>
          )}
        </>
      )}
    </Card>
  );
}
