import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import { formatRelativeTime, snippet } from "../utils/noteFormatting";

export default function NoteListRow({ note, onOpen, onToggleFavorite }) {
  return (
    <motion.button
      layout
      onClick={() => onOpen(note)}
      className="w-full flex items-center gap-4 bg-surface border border-border rounded-xl px-4 py-3.5 text-left hover:shadow-soft transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(note.id);
        }}
        aria-label={note.favorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={note.favorite}
        className="shrink-0 p-1.5 rounded-lg hover:bg-primary-soft/60 transition-colors"
      >
        <Star
          size={16}
          strokeWidth={1.75}
          className={note.favorite ? "fill-accent-hover text-accent-hover" : "text-ink-faint"}
        />
      </button>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium text-ink truncate">{note.title}</h3>
        <p className="text-xs text-ink-muted truncate">{snippet(note.content, 90)}</p>
      </div>

      <div className="hidden sm:flex gap-1.5 shrink-0">
        {note.tags.map((tag) => (
          <Badge key={tag} variant="primary">{tag}</Badge>
        ))}
      </div>

      <span className="text-xs text-ink-faint shrink-0 w-16 text-right">
        {formatRelativeTime(note.updatedAt)}
      </span>
    </motion.button>
  );
}
