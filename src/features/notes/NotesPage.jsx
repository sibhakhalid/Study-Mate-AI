import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotes } from "./hooks/useNotes";
import NotesToolbar from "./components/NotesToolbar";
import NoteCard from "./components/NoteCard";
import NoteListRow from "./components/NoteListRow";
import NotesEmptyState from "./components/NotesEmptyState";
import NotesSkeleton from "./components/NotesSkeleton";
import NotesErrorState from "./components/NotesErrorState";
import NotePreviewPanel from "./components/NotePreviewPanel";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

export default function NotesPage() {
  const { notes, loading, error, fetchNotes, removeNote, toggleFavorite } = useNotes();

  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("updated");
  const [view, setView] = useState("grid");
  const [previewNote, setPreviewNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Deterministic error-state trigger, consistent with authService's
  // "error@test.com" pattern -- search "force-error" to see NotesErrorState.
  useEffect(() => {
    if (searchValue.trim().toLowerCase() === "force-error") {
      fetchNotes("force-error");
    }
  }, [searchValue, fetchNotes]);

  const displayedNotes = useMemo(() => {
    let result = notes;

    if (searchValue.trim() && searchValue.trim().toLowerCase() !== "force-error") {
      const q = searchValue.trim().toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }

    if (filter === "favorites") {
      result = result.filter((n) => n.favorite);
    }

    result = [...result].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return result;
  }, [notes, searchValue, filter, sort]);

  function handleRetry() {
    setSearchValue("");
    fetchNotes("");
  }

  async function handleConfirmDelete() {
    await removeNote(deleteTarget.id);
    if (previewNote?.id === deleteTarget.id) setPreviewNote(null);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">Notes</h1>
      </div>

      <NotesToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
      />

      {loading && <NotesSkeleton view={view} />}

      {!loading && error && <NotesErrorState message={error} onRetry={handleRetry} />}

      {!loading && !error && displayedNotes.length === 0 && (
        <NotesEmptyState isFiltered={!!searchValue.trim() || filter !== "all"} />
      )}

      {!loading && !error && displayedNotes.length > 0 && (
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {displayedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onOpen={setPreviewNote}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" layout className="space-y-2">
              {displayedNotes.map((note) => (
                <NoteListRow
                  key={note.id}
                  note={note}
                  onOpen={setPreviewNote}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <NotePreviewPanel
        note={previewNote}
        onClose={() => setPreviewNote(null)}
        onDelete={(id) => setDeleteTarget({ id })}
        onToggleFavorite={toggleFavorite}
      />

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <Modal.Header onClose={() => setDeleteTarget(null)}>Delete this note?</Modal.Header>
        <Modal.Body>This action can't be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
