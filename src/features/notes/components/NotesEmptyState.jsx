import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NotebookPen, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function NotesEmptyState({ isFiltered }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6 bg-surface rounded-2xl border border-border border-dashed"
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft mb-4">
        <NotebookPen className="w-6 h-6 text-primary-hover" strokeWidth={1.75} />
      </span>
      <h3 className="font-display text-lg font-medium text-ink mb-1.5">
        {isFiltered ? "No matching notes" : "No notes yet"}
      </h3>
      <p className="text-sm text-ink-muted max-w-xs mb-6">
        {isFiltered
          ? "Try a different search or filter."
          : "Create your first note to get started."}
      </p>
      {!isFiltered && (
        <Link to="/notes/new">
          <Button variant="primary" icon={Plus}>Create a note</Button>
        </Link>
      )}
    </motion.div>
  );
}
