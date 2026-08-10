import { apiRequest, isBackendConfigured } from "../../../services/httpClient";
import { normalizeDoc, normalizeDocs } from "../../../utils/normalizeMongoDoc";

/**
 * Two implementations behind one interface — see notesService.js for
 * the full rationale. Backend mode calls the real Gemini-backed
 * tutor chat endpoints; mock mode keeps the original canned-reply
 * simulation so the app stays demoable without a backend running.
 *
 * To test the error state in the UI (mock mode only): send the message
 * "force-error".
 */

const USE_BACKEND = isBackendConfigured;

const STORAGE_KEY = "studymate.tutorConversations";
const THINKING_LATENCY = 1400;

const CANNED_REPLIES = [
  "That's a good question — let's break it into smaller pieces so it's easier to hold onto. Once Gemini is connected here, I'll give you a real, worked-through explanation instead of this placeholder.",
  "Here's a simple way to start thinking about that: focus on the core idea first, then the details. (This is a placeholder reply — real AI reasoning connects in a later phase.)",
  "Good instinct to ask about this — it trips a lot of people up. For now this is a stand-in response while the AI Tutor UI is being built; the real explanation will come from Gemini.",
];

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStore(conversations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeId(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function normalizeConversation(conversation) {
  const doc = normalizeDoc(conversation);
  return { ...doc, messages: normalizeDocs(doc.messages || []) };
}

/**
 * The backend's list endpoint deliberately omits each conversation's
 * `messages` array for scalability (see backend tutorChatService.js) —
 * but TutorChatContext keeps full conversations (messages included) in
 * state and reads activeConversation.messages directly. Rather than
 * restructure that context to lazy-load messages on selection, this
 * fetches full detail for each conversation in the (typically small,
 * unlike notes or quiz history) list. Revisit if conversation counts
 * ever grow large enough for this to matter.
 */
export async function getConversations() {
  if (USE_BACKEND) {
    // See notesService.getNotes for why an explicit limit matters —
    // same truncation risk applies to conversation history.
    const list = await apiRequest("/tutor-chat/conversations?limit=100");
    const full = await Promise.all(
      normalizeDocs(list).map((c) => apiRequest(`/tutor-chat/conversations/${c.id}`))
    );
    return full.map(normalizeConversation);
  }

  await delay(300);
  return readStore().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function createConversation() {
  if (USE_BACKEND) {
    const conversation = await apiRequest("/tutor-chat/conversations", { method: "POST" });
    return normalizeConversation(conversation);
  }

  await delay(150);
  const now = new Date().toISOString();
  const conversation = {
    id: makeId("c"),
    title: "New chat",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  const conversations = readStore();
  writeStore([conversation, ...conversations]);
  return conversation;
}

export async function deleteConversation(id) {
  if (USE_BACKEND) {
    await apiRequest(`/tutor-chat/conversations/${id}`, { method: "DELETE" });
    return { success: true };
  }

  await delay(300);
  writeStore(readStore().filter((c) => c.id !== id));
  return { success: true };
}

/**
 * Appends the user's message, gets a real Gemini reply (or a simulated
 * one in mock mode), and returns the updated conversation.
 */
export async function sendMessage(conversationId, userText) {
  if (USE_BACKEND) {
    const conversation = await apiRequest(`/tutor-chat/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content: userText }),
    });
    return normalizeConversation(conversation);
  }

  const conversations = readStore();
  const index = conversations.findIndex((c) => c.id === conversationId);
  if (index === -1) throw new Error("Conversation not found");

  const now = new Date().toISOString();
  const userMessage = { id: makeId("m"), role: "user", content: userText, timestamp: now };

  const conversation = conversations[index];
  const isFirstMessage = conversation.messages.length === 0;
  const withUserMessage = {
    ...conversation,
    title: isFirstMessage ? userText.slice(0, 48) : conversation.title,
    messages: [...conversation.messages, userMessage],
    updatedAt: now,
  };
  conversations[index] = withUserMessage;
  writeStore(conversations);

  await delay(THINKING_LATENCY);

  if (userText.trim().toLowerCase() === "force-error") {
    throw new Error("The AI Tutor couldn't respond. Please try again.");
  }

  const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
  const assistantMessage = {
    id: makeId("m"),
    role: "assistant",
    content: reply,
    timestamp: new Date().toISOString(),
  };

  const latest = readStore();
  const latestIndex = latest.findIndex((c) => c.id === conversationId);
  const withReply = {
    ...latest[latestIndex],
    messages: [...latest[latestIndex].messages, assistantMessage],
    updatedAt: new Date().toISOString(),
  };
  latest[latestIndex] = withReply;
  writeStore(latest);

  return withReply;
}
