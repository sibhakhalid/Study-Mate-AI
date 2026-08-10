import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";
import { mockTopics, questionCountOptions, difficultyOptions } from "../data/mockTopics";
import { isBackendConfigured } from "../../../services/httpClient";

// The "force error" card is a dev-only way to exercise the failure UI
// without a backend — like notes' "force-error" search term and
// flashcards' force-error deck, it has no place in front of a real
// user once a real backend (and real Gemini calls) are connected.
const USE_BACKEND = isBackendConfigured;
const topicChoices = USE_BACKEND ? mockTopics.filter((t) => t.id !== "force-error") : mockTopics;

export default function QuizConfigModal({ isOpen, onClose, onGenerate, generating }) {
  const [topicId, setTopicId] = useState(topicChoices[0].id);
  const [numQuestions, setNumQuestions] = useState(questionCountOptions[0]);
  const [difficulty, setDifficulty] = useState(difficultyOptions[1]);

  function handleGenerate() {
    const topic = topicChoices.find((t) => t.id === topicId);
    onGenerate({ topicId, topicTitle: topic.title, numQuestions, difficulty });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <Modal.Header onClose={onClose}>New quiz</Modal.Header>
      <Modal.Body className="space-y-5">
        <div>
          <p className="text-sm font-medium text-ink mb-2">Topic</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topicChoices.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setTopicId(topic.id)}
                className={cn(
                  "flex items-start gap-2.5 text-left px-3.5 py-3 rounded-xl border text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                  topicId === topic.id
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary/40"
                )}
              >
                <topic.icon size={16} strokeWidth={1.75} className="shrink-0 mt-0.5 text-primary-hover" />
                <span>
                  <span className="block font-medium text-ink">{topic.title}</span>
                  <span className="block text-xs text-ink-muted mt-0.5">{topic.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-ink mb-2">Number of questions</p>
          <div className="flex gap-2">
            {questionCountOptions.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setNumQuestions(count)}
                className={cn(
                  "flex-1 py-2 rounded-xl border text-sm font-medium transition-colors",
                  numQuestions === count
                    ? "border-primary bg-primary-soft text-ink"
                    : "border-border text-ink-muted hover:border-primary/40"
                )}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-ink mb-2">Difficulty</p>
          <div className="flex gap-2">
            {difficultyOptions.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={cn(
                  "flex-1 py-2 rounded-xl border text-sm font-medium transition-colors",
                  difficulty === level
                    ? "border-primary bg-primary-soft text-ink"
                    : "border-border text-ink-muted hover:border-primary/40"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" loading={generating} onClick={handleGenerate}>
          {generating ? "Generating..." : "Generate quiz"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
