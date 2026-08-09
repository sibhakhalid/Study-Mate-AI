import { Note } from "../models/Note.js";
import { summarizeNote as summarizeWithGemini } from "./geminiService.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, paginateQuery } from "../utils/pagination.js";

export async function listNotes(userId, query) {
  const { searchTerm, tag, favorite, ...paginationQuery } = query;
  const filter = { user: userId };

  if (tag) filter.tags = tag;
  if (favorite !== undefined) filter.favorite = favorite === "true";
  if (searchTerm) filter.$text = { $search: searchTerm };

  const pagination = parsePagination(paginationQuery);
  return paginateQuery(Note, filter, pagination, { sort: { updatedAt: -1 } });
}

export async function getNoteById(userId, noteId) {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw ApiError.notFound("Note not found");
  return note;
}

export async function createNote(userId, data) {
  return Note.create({ ...data, user: userId });
}

export async function updateNote(userId, noteId, updates) {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!note) throw ApiError.notFound("Note not found");
  return note;
}

export async function deleteNote(userId, noteId) {
  const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
  if (!note) throw ApiError.notFound("Note not found");
}

export async function toggleFavorite(userId, noteId) {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw ApiError.notFound("Note not found");
  note.favorite = !note.favorite;
  await note.save();
  return note;
}

/** Generates (or regenerates) an AI summary for a note via Gemini and persists it. */
export async function summarizeNote(userId, noteId) {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw ApiError.notFound("Note not found");
  if (!note.content?.trim()) {
    throw ApiError.badRequest("Add some content to this note before summarizing it.");
  }

  const { summary, keyPoints } = await summarizeWithGemini({ content: note.content });

  note.summary = summary;
  note.summaryKeyPoints = keyPoints;
  note.summaryGeneratedAt = new Date();
  await note.save();
  return note;
}
