import { motion } from "framer-motion";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";

export default function DeckCard({ deck, onSelect }) {
  return (
    <motion.div layout>
      <Card variant="interactive" onClick={() => onSelect(deck)} className="h-full">
        <div className="flex items-start justify-between mb-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-soft">
            <deck.icon className="w-5 h-5 text-primary-hover" strokeWidth={1.75} />
          </span>
          {deck.masteryPercent !== null && (
            <Badge variant={deck.masteryPercent >= 70 ? "secondary" : "neutral"}>
              {deck.masteryPercent}% mastered
            </Badge>
          )}
        </div>
        <h3 className="font-display text-base font-medium text-ink mb-1">{deck.title}</h3>
        <p className="text-sm text-ink-muted leading-relaxed mb-3">{deck.description}</p>
        <p className="text-xs text-ink-faint">{deck.cardCount} cards</p>
      </Card>
    </motion.div>
  );
}
