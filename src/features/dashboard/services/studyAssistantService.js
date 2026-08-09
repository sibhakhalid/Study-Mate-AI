import { apiRequest } from "../../../services/httpClient";

/**
 * Purely AI-backed — unlike other features, there's no meaningful mock
 * for "personalized study recommendations" or "answer this question,"
 * so both functions require a connected backend and throw a clear
 * message otherwise rather than faking a plausible-looking answer.
 */

const USE_BACKEND = Boolean(import.meta.env.VITE_API_BASE_URL);

function requireBackend() {
  if (!USE_BACKEND) {
    throw new Error(
      "The Study Assistant needs a connected backend. Set VITE_API_BASE_URL to use this feature."
    );
  }
}

export async function ask(question, noteId) {
  requireBackend();
  return apiRequest("/study-assistant/ask", {
    method: "POST",
    body: JSON.stringify({ question, noteId }),
  });
}

export async function getRecommendations() {
  requireBackend();
  return apiRequest("/study-assistant/recommendations");
}
