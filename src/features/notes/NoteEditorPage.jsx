import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useNotes } from "./hooks/useNotes";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import NoteSummaryPanel from "./components/NoteSummaryPanel";

/**
 * One page, two modes — determined purely by whether :id is present.
 * Avoids a near-duplicate "CreateNotePage" that would drift out of sync
 * with this one over time.
 */
export default function NoteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, loading: notesLoading, addNote, editNote, summarizeNote } = useNotes();

  const isEditMode = !!id;
  const existingNote = isEditMode ? notes.find((n) => n.id === id) : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [titleError, setTitleError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setTagsInput(existingNote.tags.join(", "));
    }
  }, [existingNote]);

  // Editing a note that doesn't exist (bad URL, or not loaded yet)
  if (isEditMode && !notesLoading && !existingNote) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="font-display text-xl font-medium text-ink mb-2">Note not found</h2>
        <p className="text-sm text-ink-muted mb-6">
          This note may have been deleted.
        </p>
        <Link to="/notes">
          <Button variant="secondary">Back to notes</Button>
        </Link>
      </div>
    );
  }

  async function handleSave() {
    if (!title.trim()) {
      setTitleError("Give your note a title");
      return;
    }
    setTitleError(null);
    setSaveError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      if (isEditMode) {
        await editNote(id, { title, content, tags });
      } else {
        await addNote({ title, content, tags });
      }
      navigate("/notes");
    } catch (err) {
      // Without this, a failed save (auth expired, validation error,
      // network blip) just silently stopped the loading spinner with
      // no feedback at all — indistinguishable from "notes don't save."
      setSaveError(err.message || "Couldn't save this note. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-2xl mx-auto space-y-5"
    >
      <div className="flex items-center justify-between">
        <Link
          to="/notes"
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Back to notes
        </Link>
      </div>

      <h1 className="font-display text-2xl font-medium text-ink">
        {isEditMode ? "Edit note" : "New note"}
      </h1>

      <div className="bg-surface border border-border rounded-2xl shadow-soft p-6 space-y-5">
        <Input
          label="Title"
          placeholder="Give your note a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="note-content" className="text-sm font-medium text-ink">
            Content
          </label>
          <textarea
            id="note-content"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>

        <Input
          label="Tags"
          placeholder="e.g. Biology, Chapter 4"
          helperText="Separate tags with commas"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      {isEditMode && existingNote && (
        <NoteSummaryPanel note={existingNote} onSummarize={summarizeNote} />
      )}

      {saveError && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
        >
          <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
          {saveError}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Link to="/notes">
          <Button variant="ghost">Cancel</Button>
        </Link>
        <Button variant="primary" icon={Save} loading={saving} onClick={handleSave}>
          {saving ? "Saving..." : "Save note"}
        </Button>
      </div>
    </motion.div>
  );
}
