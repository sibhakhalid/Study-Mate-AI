import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { useTutorChat } from "./hooks/useTutorChat";
import ConversationHistoryList from "./components/ConversationHistoryList";
import ChatMessage from "./components/ChatMessage";
import ChatEmptyState from "./components/ChatEmptyState";
import TypingIndicator from "./components/TypingIndicator";
import ChatErrorState from "./components/ChatErrorState";
import ChatInput from "./components/ChatInput";

const USE_BACKEND = Boolean(import.meta.env.VITE_API_BASE_URL);

export default function AiTutorPage() {
  const {
    conversations,
    activeConversation,
    activeId,
    loadingConversations,
    sending,
    error,
    startNewConversation,
    selectConversation,
    removeConversation,
    sendMessage,
  } = useTutorChat();

  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const scrollRef = useRef(null);
  const lastSentRef = useRef("");

  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, sending]);

  function handleSend(text) {
    lastSentRef.current = text;
    sendMessage(text);
  }

  function handleRetry() {
    if (lastSentRef.current) sendMessage(lastSentRef.current);
  }

  return (
    // Negative margin cancels AppLayout's <main> padding so this page can
    // own a true edge-to-edge two-pane chat layout at full height.
    <div className="-m-4 md:-m-8 h-[calc(100vh-4rem)] flex bg-background">
      <ConversationHistoryList
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNew={startNewConversation}
        onDelete={removeConversation}
        mobileOpen={mobileHistoryOpen}
        onMobileClose={() => setMobileHistoryOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 px-4 md:px-6 h-14 border-b border-border shrink-0">
          <button
            onClick={() => setMobileHistoryOpen(true)}
            aria-label="Open conversation history"
            className="md:hidden p-1.5 -ml-1 rounded-lg text-ink-muted hover:bg-primary-soft/60 transition-colors"
          >
            <Menu size={18} strokeWidth={1.75} />
          </button>
          <h1 className="font-display text-base font-medium text-ink truncate">
            {activeConversation?.title ?? "AI Tutor"}
          </h1>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
          {loadingConversations ? (
            <div className="flex items-center justify-center h-full text-sm text-ink-faint">
              Loading your conversations...
            </div>
          ) : messages.length === 0 ? (
            <ChatEmptyState onSelectPrompt={handleSend} />
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto">
              {messages.map((message) => (
                <ChatMessage key={message.id} role={message.role} content={message.content} />
              ))}
              {sending && <TypingIndicator />}
              {error && <ChatErrorState message={error} onRetry={handleRetry} />}
            </div>
          )}
        </div>

        <div className="px-4 md:px-6 pb-5 pt-2 max-w-2xl w-full mx-auto shrink-0">
          <ChatInput onSend={handleSend} disabled={sending || loadingConversations} />
          {!USE_BACKEND && (
            <p className="text-center text-xs text-ink-faint mt-2">
              Showing simulated replies — connect a backend to chat with the real AI Tutor.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
