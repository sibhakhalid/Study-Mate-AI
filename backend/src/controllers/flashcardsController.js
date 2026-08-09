import * as flashcardsService from "../services/flashcardsService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listDecks = asyncHandler(async (req, res) => {
  const { items, pagination } = await flashcardsService.listDecks(req.user._id, req.query);
  new ApiResponse(200, items, "Decks retrieved").send(res, pagination);
});

export const getDeck = asyncHandler(async (req, res) => {
  const deck = await flashcardsService.getDeck(req.user._id, req.params.id);
  new ApiResponse(200, deck).send(res);
});

export const createDeck = asyncHandler(async (req, res) => {
  const deck = await flashcardsService.createDeck(req.user._id, req.body);
  new ApiResponse(201, deck, "Deck created").send(res);
});

export const deleteDeck = asyncHandler(async (req, res) => {
  await flashcardsService.deleteDeck(req.user._id, req.params.id);
  new ApiResponse(200, { id: req.params.id }, "Deck deleted").send(res);
});

export const listDeckCards = asyncHandler(async (req, res) => {
  const cards = await flashcardsService.listDeckCards(req.user._id, req.params.id);
  new ApiResponse(200, cards).send(res);
});

export const generateDeck = asyncHandler(async (req, res) => {
  const result = await flashcardsService.generateDeck(req.user._id, req.body);
  new ApiResponse(201, result, "Deck generated").send(res);
});

export const reviewCard = asyncHandler(async (req, res) => {
  const card = await flashcardsService.reviewCard(
    req.user._id,
    req.params.id,
    req.body.reviewState
  );
  new ApiResponse(200, card, "Card review recorded").send(res);
});
