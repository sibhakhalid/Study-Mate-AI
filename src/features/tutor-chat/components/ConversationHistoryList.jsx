import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Trash2, X } from "lucide-react";
import { cn } from "../../../utils/cn";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";

function ListContent({ conversations, activeId, onSelect, onNew, onDelete, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <button
          onClick={() => {
            onNew();
            onNavigate?.();
          }}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-ink text-sm font-medium rounded-xl px-3.5 py-2.5 transition-colors"
        >
          <Plus size={16} strokeWidth={1.75} />
          New chat
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto px-2 space-y-1">
        {conversations.map((conversation) => (
          <li key={conversation.id} className="group relative">
            <button
              onClick={() => {
                onSelect(conversation.id);
                onNavigate?.();
              }}
              className={cn(
                "w-full flex items-start gap-2.5 text-left px-3 py-2.5 rounded-xl text-sm transition-colors pr-8",
                conversation.id === activeId
                  ? "bg-primary-soft text-ink"
                  : "text-ink-muted hover:bg-primary-soft/50 hover:text-ink"
              )}
            >
              <MessageSquare size={15} strokeWidth={1.75} className="shrink-0 mt-0.5" />
              <span className="min-w-0">
                <span className="block truncate">{conversation.title}</span>
                <span className="block text-xs text-ink-faint mt-0.5">
                  {formatRelativeTime(conversation.updatedAt)}
                </span>
              </span>
            </button>
            <button
              onClick={() => onDelete(conversation.id)}
              aria-label={`Delete conversation: ${conversation.title}`}
              className="absolute right-2 top-2.5 p-1 rounded-lg text-ink-faint opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all focus-visible:opacity-100"
            >
              <Trash2 size={13} strokeWidth={1.75} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ConversationHistoryList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  mobileOpen,
  onMobileClose,
}) {
  return (
    <>
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-surface border-r border-border">
        <ListContent
          conversations={conversations}
          activeId={activeId}
          onSelect={onSelect}
          onNew={onNew}
          onDelete={onDelete}
        />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-ink/20 z-40 md:hidden"
              onClick={onMobileClose}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label="Conversation history"
              className="fixed inset-y-0 left-0 w-72 bg-surface z-50 md:hidden shadow-lift flex flex-col"
            >
              <div className="flex justify-end px-3 pt-3">
                <button
                  onClick={onMobileClose}
                  aria-label="Close conversation history"
                  className="p-2 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors"
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
              </div>
              <ListContent
                conversations={conversations}
                activeId={activeId}
                onSelect={onSelect}
                onNew={onNew}
                onDelete={onDelete}
                onNavigate={onMobileClose}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
