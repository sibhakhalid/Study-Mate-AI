const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Normalizes page/limit query params into a Mongoose-ready { skip, limit }
 * pair, clamped to sane bounds. Every list endpoint that could grow
 * unbounded (notes, quiz attempts, decks, tutor conversations) uses this
 * rather than returning `Model.find(filter)` with no bound — an easy
 * thing to miss early on that becomes a real problem once a user has
 * a few hundred notes.
 */
export function parsePagination(query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Runs the find + count in parallel and returns a consistent envelope
 * so every paginated list in the API has the same shape on the wire.
 */
export async function paginateQuery(model, filter, { skip, limit, page }, options = {}) {
  const { sort = { createdAt: -1 }, select, populate } = options;

  let query = model.find(filter).sort(sort).skip(skip).limit(limit);
  if (select) query = query.select(select);
  if (populate) query = query.populate(populate);

  const [items, total] = await Promise.all([query, model.countDocuments(filter)]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}
