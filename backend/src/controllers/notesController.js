import * as notesService from "../services/notesService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listNotes = asyncHandler(async (req, res) => {
  const { items, pagination } = await notesService.listNotes(req.user._id, req.query);
  new ApiResponse(200, items, "Notes retrieved").send(res, pagination);
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await notesService.getNoteById(req.user._id, req.params.id);
  new ApiResponse(200, note).send(res);
});

export const createNote = asyncHandler(async (req, res) => {
  const note = await notesService.createNote(req.user._id, req.body);
  new ApiResponse(201, note, "Note created").send(res);
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await notesService.updateNote(req.user._id, req.params.id, req.body);
  new ApiResponse(200, note, "Note updated").send(res);
});

export const deleteNote = asyncHandler(async (req, res) => {
  await notesService.deleteNote(req.user._id, req.params.id);
  new ApiResponse(200, { id: req.params.id }, "Note deleted").send(res);
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const note = await notesService.toggleFavorite(req.user._id, req.params.id);
  new ApiResponse(200, note, "Favorite toggled").send(res);
});

export const summarizeNote = asyncHandler(async (req, res) => {
  const note = await notesService.summarizeNote(req.user._id, req.params.id);
  new ApiResponse(200, note, "Summary generated").send(res);
});
