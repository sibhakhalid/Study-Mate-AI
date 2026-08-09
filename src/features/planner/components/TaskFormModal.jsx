import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";
import { subjects } from "../data/subjects";
import { dateKey } from "../utils/dateHelpers";

const emptyForm = {
  title: "",
  subjectId: subjects[0].id,
  date: dateKey(new Date()),
  startTime: "",
  durationMinutes: "",
  type: "study",
};

/**
 * One modal, two modes — same consolidation reasoning as NoteEditorPage:
 * create and edit are the same form, differing only in whether
 * `initialTask` is provided.
 */
export default function TaskFormModal({ isOpen, onClose, onSave, initialTask, saving, error }) {
  const [form, setForm] = useState(emptyForm);
  const [titleError, setTitleError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialTask
          ? {
              title: initialTask.title,
              subjectId: initialTask.subjectId,
              date: initialTask.date,
              startTime: initialTask.startTime || "",
              durationMinutes: initialTask.durationMinutes || "",
              type: initialTask.type,
            }
          : emptyForm
      );
      setTitleError(null);
    }
  }, [isOpen, initialTask]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!form.title.trim()) {
      setTitleError("Give the task a title");
      return;
    }
    onSave({
      ...form,
      durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <Modal.Header onClose={onClose}>
        {initialTask ? "Edit task" : "New task"}
      </Modal.Header>
      <Modal.Body className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Review Chapter 4 notes"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          error={titleError}
        />

        <div>
          <p className="text-sm font-medium text-ink mb-2">Type</p>
          <div className="flex gap-2">
            {["study", "deadline"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => update("type", type)}
                className={cn(
                  "flex-1 py-2 rounded-xl border text-sm font-medium capitalize transition-colors",
                  form.type === type
                    ? "border-primary bg-primary-soft text-ink"
                    : "border-border text-ink-muted hover:border-primary/40"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-ink mb-2">Subject</p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                type="button"
                onClick={() => update("subjectId", subject.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-xs font-medium transition-colors",
                  form.subjectId === subject.id
                    ? "border-primary bg-primary-soft text-ink"
                    : "border-border text-ink-muted hover:border-primary/40"
                )}
              >
                {subject.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
          <Input
            label="Time (optional)"
            type="time"
            value={form.startTime}
            onChange={(e) => update("startTime", e.target.value)}
          />
        </div>

        <Input
          label="Duration in minutes (optional)"
          type="number"
          min="0"
          placeholder="e.g. 30"
          value={form.durationMinutes}
          onChange={(e) => update("durationMinutes", e.target.value)}
        />

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
          >
            <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
            {error}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" loading={saving} onClick={handleSave}>
          {saving ? "Saving..." : "Save task"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
