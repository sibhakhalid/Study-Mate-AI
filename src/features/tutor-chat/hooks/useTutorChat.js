import { useContext } from "react";
import { TutorChatContext } from "../context/TutorChatContext";

export function useTutorChat() {
  const ctx = useContext(TutorChatContext);
  if (!ctx) {
    throw new Error("useTutorChat must be used within a TutorChatProvider");
  }
  return ctx;
}
