import { Layers } from "lucide-react";
import Card from "../../../components/ui/Card";

export default function FlashcardMasteryCard({ decks }) {
  return (
    <Card variant="default">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-medium text-ink">Flashcard mastery</h3>
        <Layers className="w-4 h-4 text-ink-faint" strokeWidth={1.75} />
      </div>
      <ul className="space-y-4">
        {decks.map((deck) => (
          <li key={deck.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-ink">{deck.title}</span>
              <span className="text-xs text-ink-faint">
                {deck.masteryPercent !== null ? `${deck.masteryPercent}%` : "Not studied"}
              </span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-300"
                style={{ width: `${deck.masteryPercent ?? 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
