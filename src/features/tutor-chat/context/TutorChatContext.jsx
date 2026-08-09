import { createContext, useCallback, useEffect, useState } from "react";
import * as tutorChatService from "../services/tutorChatService";
import { useAuth } from "../../auth/context/useAuth";

export const TutorChatContext = createContext(null);

export function TutorChatProvider({ children }) {
  const { firebaseUser, initializing } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const result = await tutorChatService.getConversations();
      // A fresh visitor gets one empty conversation ready to type into,
      // rather than landing on a blank "no chats" screen.
      if (result.length === 0) {
        const first = await tutorChatService.createConversation();
        setConversations([first]);
        setActiveId(first.id);
      } else {
        setConversations(result);
        setActiveId((current) => current ?? result[0].id);
      }
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  // See NotesContext for why this waits for auth — same global-mount concern.
  useEffect(() => {
    if (initializing) return;
    if (firebaseUser) {
      loadConversations();
    } else {
      setConversations([]);
      setActiveId(null);
      setLoadingConversations(false);
    }
  }, [firebaseUser, initializing, loadConversations]);

  const startNewConversation = useCallback(async () => {
    const conversation = await tutorChatService.createConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setError(null);
    return conversation;
  }, []);

  const selectConversation = useCallback((id) => {
    setActiveId(id);
    setError(null);
  }, []);

  const removeConversation = useCallback(
    async (id) => {
      await tutorChatService.deleteConversation(id);
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          setActiveId(next[0]?.id ?? null);
        }
        return next;
      });
    },
    [activeId]
  );

  const sendMessage = useCallback(async (text) => {
    if (!activeId || !text.trim()) return;
    setSending(true);
    setError(null);
    try {
      const updated = await tutorChatService.sendMessage(activeId, text.trim());
      setConversations((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }, [activeId]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  return (
    <TutorChatContext.Provider
      value={{
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
      }}
    >
      {children}
    </TutorChatContext.Provider>
  );
}
