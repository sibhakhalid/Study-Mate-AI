/**
 * Every mock service used `id` as the primary key field. Real backend
 * documents come back with Mongo's `_id`. Rather than touch every
 * component/context that reads `.id` across the app, this normalizes
 * at the same seam httpClient already unwraps responses at — so
 * everything above the service layer keeps working unchanged.
 */
export function normalizeDoc(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const { _id, ...rest } = doc;
  return _id ? { id: _id, ...rest } : doc;
}

export function normalizeDocs(docs) {
  return Array.isArray(docs) ? docs.map(normalizeDoc) : docs;
}
