import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Rendered via portal to document.body so it's never clipped by a
 * parent's overflow-hidden (e.g. the app shell's scroll containers).
 *
 * Accessibility behavior (not optional for a real modal):
 * - Escape closes it
 * - Backdrop click closes it
 * - Focus moves into the dialog on open, back to the trigger isn't
 *   tracked here (caller's responsibility) but the dialog itself is
 *   reachable and labeled
 * - Body scroll is locked while open
 */
export default function Modal({ isOpen, onClose, title, children, className }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog so keyboard/screen-reader users land inside it
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink/25"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || "Dialog"}
            tabIndex={-1}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "relative z-10 w-full max-w-md bg-surface rounded-2xl shadow-lift border border-border",
              "focus-visible:outline-none max-h-[85vh] flex flex-col",
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

Modal.Header = function ModalHeader({ children, onClose }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
      <h2 className="font-display text-lg font-medium text-ink">{children}</h2>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="p-1.5 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors"
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ children, className }) {
  return (
    <div className={cn("px-6 py-4 overflow-y-auto text-sm text-ink-muted", className)}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
      {children}
    </div>
  );
};
