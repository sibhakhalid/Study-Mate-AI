import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  NotebookPen,
  Bot,
  HelpCircle,
  Layers,
  CalendarDays,
  TrendingUp,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavItem from "../ui/NavItem";
import Logo from "../ui/Logo";
import { useAuth } from "../../features/auth/context/useAuth";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/notes", icon: NotebookPen, label: "Notes" },
  { to: "/ai-tutor", icon: Bot, label: "AI Tutor" },
  { to: "/quiz", icon: HelpCircle, label: "Quiz" },
  { to: "/flashcards", icon: Layers, label: "Flashcards" },
  { to: "/planner", icon: CalendarDays, label: "Study Planner" },
  { to: "/progress", icon: TrendingUp, label: "Progress" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);
  return initials.toUpperCase();
}

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();
  const { firebaseUser, profile, signOutUser } = useAuth();
  const displayName = profile?.name || firebaseUser?.displayName || "Student";
  const email = profile?.email || firebaseUser?.email || "";

  async function handleSignOut() {
    await signOutUser();
    onNavigate?.();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5">
        <Logo />
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border flex items-center gap-2.5">
        <span className="w-8 h-8 shrink-0 rounded-full bg-secondary-soft border border-border flex items-center justify-center text-xs font-medium text-ink">
          {getInitials(displayName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink truncate">{displayName}</p>
          <p className="text-xs text-ink-faint truncate">{email}</p>
        </div>
        <button
          onClick={handleSignOut}
          aria-label="Log out"
          title="Log out"
          className="p-1.5 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

/**
 * Desktop: static, always visible, part of the layout flow.
 * Mobile: fixed off-canvas drawer, opens/closes via `isOpen`, controlled
 * by AppLayout so the Topbar's menu button can toggle it too.
 */
export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-surface border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile off-canvas */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-ink/20 z-40 md:hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-72 bg-surface z-50 md:hidden shadow-lift"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <div className="flex justify-end px-3 pt-3">
                <button
                  onClick={onClose}
                  aria-label="Close navigation"
                  className="p-2 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </div>
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
