import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { formatRelativeTime, snippet } from "../utils/noteFormatting";

export default function NoteCard({ note, onOpen, onToggleFavorite }) {
  return (
    <motion.div layout>
      <Card
        variant="interactive"
        as="div"
        onClick={() => onOpen(note)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(note);
          }
        }}
        role="button"
        tabIndex={0}
        className="h-full flex flex-col"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-base font-medium text-ink leading-snug line-clamp-2">
            {note.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(note.id);
            }}
            aria-label={note.favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={note.favorite}
            className="shrink-0 p-1 -mr-1 -mt-1 rounded-lg hover:bg-primary-soft/60 transition-colors"
          >
            <Star
              size={16}
              strokeWidth={1.75}
              className={note.favorite ? "fill-accent-hover text-accent-hover" : "text-ink-faint"}
            />
          </button>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed mb-4 line-clamp-3 flex-1">
          {snippet(note.content)}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="primary">{tag}</Badge>
            ))}
          </div>
          <span className="text-xs text-ink-faint shrink-0">
            {formatRelativeTime(note.updatedAt)}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
