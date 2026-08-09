import { createContext, useCallback, useEffect, useState } from "react";
import * as notesService from "../services/notesService";
import { useAuth } from "../../auth/context/useAuth";

export const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const { firebaseUser, initializing } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async (searchTerm = "") => {
    setLoading(true);
    setError(null);
    try {
      const result = await notesService.getNotes({ searchTerm });
      setNotes(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mounted globally (App.jsx wraps the whole router, including the
  // public landing/login pages) — must wait for a signed-in user before
  // fetching, or every signed-out page load fires a guaranteed 401.
  useEffect(() => {
    if (initializing) return;
    if (firebaseUser) {
      fetchNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [firebaseUser, initializing, fetchNotes]);

  const addNote = useCallback(async (data) => {
    const note = await notesService.createNote(data);
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const editNote = useCallback(async (id, updates) => {
    const updated = await notesService.updateNote(id, updates);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  const removeNote = useCallback(async (id) => {
    await notesService.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleFavorite = useCallback(async (id) => {
    const updated = await notesService.toggleFavorite(id);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  const summarizeNote = useCallback(async (id) => {
    const updated = await notesService.summarizeNote(id);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        fetchNotes,
        addNote,
        editNote,
        removeNote,
        toggleFavorite,
        summarizeNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
