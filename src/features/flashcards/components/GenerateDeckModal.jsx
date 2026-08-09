import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { cn } from "../../../utils/cn";

const CARD_COUNT_OPTIONS = [5, 8, 12];

export default function GenerateDeckModal({ isOpen, onClose, onGenerate, generating }) {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(CARD_COUNT_OPTIONS[1]);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    if (!topic.trim()) {
      setError("Enter a topic to generate flashcards for.");
      return;
    }
    setError(null);
    try {
      await onGenerate({ topic: topic.trim(), count });
      setTopic("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <Modal.Header onClose={onClose}>Generate a deck with AI</Modal.Header>
      <Modal.Body className="space-y-5">
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
          >
            <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
            {error}
          </div>
        )}

        <Input
          label="Topic"
          placeholder="e.g. Photosynthesis, The French Revolution, Big-O notation"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          helperText="Gemini will write flashcards covering this topic."
        />

        <div>
          <p className="text-sm font-medium text-ink mb-2">Number of cards</p>
          <div className="flex gap-2">
            {CARD_COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={cn(
                  "flex-1 py-2 rounded-xl border text-sm font-medium transition-colors",
                  count === n
                    ? "border-primary bg-primary-soft text-ink"
                    : "border-border text-ink-muted hover:border-primary/40"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" loading={generating} onClick={handleGenerate}>
          {generating ? "Generating..." : "Generate deck"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
