import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Trash2, Star } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { formatRelativeTime } from "../utils/noteFormatting";

/**
 * Quick "glance" view — read-only, fast to open/close, distinct from
 * the full NoteEditorPage. Portaled like Modal, but slides from the
 * right instead of centering, since it's a panel not a dialog decision.
 */
export default function NotePreviewPanel({ note, onClose, onDelete, onToggleFavorite }) {
  const navigate = useNavigate();

  return createPortal(
    <AnimatePresence>
      {note && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink/20 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={`Preview of ${note.title}`}
            className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-surface z-50 shadow-lift flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <span className="text-xs font-medium text-ink-faint">
                Updated {formatRelativeTime(note.updatedAt)}
              </span>
              <button
                onClick={onClose}
                aria-label="Close preview"
                className="p-1.5 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-display text-xl font-medium text-ink leading-snug">
                  {note.title}
                </h2>
                <button
                  onClick={() => onToggleFavorite(note.id)}
                  aria-label={note.favorite ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={note.favorite}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-primary-soft/60 transition-colors"
                >
                  <Star
                    size={18}
                    strokeWidth={1.75}
                    className={note.favorite ? "fill-accent-hover text-accent-hover" : "text-ink-faint"}
                  />
                </button>
              </div>

              <div className="flex gap-1.5 flex-wrap mb-5">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="primary">{tag}</Badge>
                ))}
              </div>

              <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                {note.content}
              </p>
            </div>

            <div className="flex items-center gap-2 px-5 py-4 border-t border-border shrink-0">
              <Button
                variant="primary"
                icon={Pencil}
                className="flex-1"
                onClick={() => navigate(`/notes/${note.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                icon={Trash2}
                aria-label="Delete note"
                onClick={() => onDelete(note.id)}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
