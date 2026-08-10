import { seedNotes } from "../data/mockNotes";
import { apiRequest, isBackendConfigured } from "../../../services/httpClient";
import { normalizeDoc, normalizeDocs } from "../../../utils/normalizeMongoDoc";

/**
 * Two implementations behind one interface: when VITE_API_BASE_URL is
 * set, every function calls the real Express/MongoDB/Gemini backend.
 * Otherwise it falls back to the original localStorage mock — so the
 * app stays fully demoable without a backend running, and NotesContext
 * (the only caller) never needs to know or care which mode it's in.
 *
 * To test the error state in the UI (mock mode only): search for
 * "force-error".
 */

const USE_BACKEND = isBackendConfigured;

const STORAGE_KEY = "studymate.notes";
const LATENCY = 500;

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedNotes));
      return [...seedNotes];
    }
    return JSON.parse(raw);
  } catch {
    return [...seedNotes];
  }
}

function writeStore(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function delay(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeId() {
  return `n${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

/** searchTerm "force-error" deterministically simulates a failed fetch (mock mode only). */
export async function getNotes({ searchTerm = "" } = {}) {
  if (USE_BACKEND) {
    // The backend paginates at 20/page by default and this app has no
    // pagination UI (page numbers, "load more") anywhere — without an
    // explicit limit, anyone with more than 20 notes would have their
    // list (and client-side search, which filters this same array)
    // silently truncated with no indication more notes exist. 100 is
    // the backend's hard max and comfortably covers realistic usage.
    const params = new URLSearchParams({ limit: "100" });
    if (searchTerm) params.set("searchTerm", searchTerm);
    const notes = await apiRequest(`/notes?${params}`);
    return normalizeDocs(notes);
  }

  await delay();
  if (searchTerm.trim().toLowerCase() === "force-error") {
    throw new Error("Couldn't load your notes. Check your connection and try again.");
  }
  return readStore();
}

export async function getNoteById(id) {
  if (USE_BACKEND) {
    const note = await apiRequest(`/notes/${id}`);
    return normalizeDoc(note);
  }

  await delay(300);
  const notes = readStore();
  const note = notes.find((n) => n.id === id);
  if (!note) throw new Error("Note not found");
  return note;
}

export async function createNote({ title, content, tags = [] }) {
  if (USE_BACKEND) {
    const note = await apiRequest("/notes", {
      method: "POST",
      body: JSON.stringify({ title: title?.trim() || "Untitled note", content, tags }),
    });
    return normalizeDoc(note);
  }

  await delay();
  const notes = readStore();
  const now = new Date().toISOString();
  const note = {
    id: makeId(),
    title: title.trim() || "Untitled note",
    content,
    tags,
    favorite: false,
    createdAt: now,
    updatedAt: now,
  };
  writeStore([note, ...notes]);
  return note;
}

export async function updateNote(id, updates) {
  if (USE_BACKEND) {
    const note = await apiRequest(`/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return normalizeDoc(note);
  }

  await delay();
  const notes = readStore();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) throw new Error("Note not found");
  const updated = { ...notes[index], ...updates, updatedAt: new Date().toISOString() };
  notes[index] = updated;
  writeStore(notes);
  return updated;
}

export async function deleteNote(id) {
  if (USE_BACKEND) {
    await apiRequest(`/notes/${id}`, { method: "DELETE" });
    return { success: true };
  }

  await delay(400);
  const notes = readStore().filter((n) => n.id !== id);
  writeStore(notes);
  return { success: true };
}

export async function toggleFavorite(id) {
  if (USE_BACKEND) {
    const note = await apiRequest(`/notes/${id}/favorite`, { method: "PATCH" });
    return normalizeDoc(note);
  }

  await delay(200);
  const notes = readStore();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) throw new Error("Note not found");
  notes[index] = { ...notes[index], favorite: !notes[index].favorite };
  writeStore(notes);
  return notes[index];
}

/**
 * AI-powered — real Gemini summary via the backend. Requires a backend
 * connection; there's no meaningful mock for "understand this note's
 * content," so this throws clearly rather than faking a summary.
 */
export async function summarizeNote(id) {
  if (!USE_BACKEND) {
    throw new Error(
      "Note summarization needs a connected backend. Set VITE_API_BASE_URL to use this feature."
    );
  }
  const note = await apiRequest(`/notes/${id}/summarize`, { method: "POST" });
  return normalizeDoc(note);
}
