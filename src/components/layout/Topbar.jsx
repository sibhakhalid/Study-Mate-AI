import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, NotebookPen, Layers, CalendarClock } from "lucide-react";
import { useAuth } from "../../features/auth/context/useAuth";
import { useNotes } from "../../features/notes/hooks/useNotes";
import { useFlashcards } from "../../features/flashcards/hooks/useFlashcards";
import { usePlanner } from "../../features/planner/hooks/usePlanner";
import { useSettings } from "../../features/settings/hooks/useSettings";
import { dateKey, addDays } from "../../utils/dateHelpers";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
  return initials.toUpperCase();
}

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/notes": "Notes",
  "/ai-tutor": "AI Tutor",
  "/quiz": "Quiz",
  "/flashcards": "Flashcards",
  "/planner": "Study Planner",
  "/progress": "Progress",
  "/settings": "Settings",
};

/** Upcoming/overdue deadline tasks within the next 3 days, this user's own planner data. */
function useDeadlineNotifications() {
  const { tasks } = usePlanner();
  const { notifications } = useSettings();

  return useMemo(() => {
    if (notifications && notifications.deadlineAlerts === false) return [];
    const today = dateKey(new Date());
    const horizon = dateKey(addDays(new Date(), 3));
    return tasks
      .filter((t) => t.type === "deadline" && !t.completed && t.date <= horizon)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((t) => ({
        id: t.id,
        label: t.title,
        overdue: t.date < today,
        date: t.date,
      }));
  }, [tasks, notifications]);
}

function useSearchResults(query) {
  const { notes } = useNotes();
  const { decks } = useFlashcards();
  const { tasks } = usePlanner();

  return useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const noteMatches = notes
      .filter((n) => n.title?.toLowerCase().includes(term))
      .slice(0, 4)
      .map((n) => ({ id: `note-${n.id}`, label: n.title, to: `/notes/${n.id}`, icon: NotebookPen, group: "Notes" }));

    const deckMatches = decks
      .filter((d) => d.title?.toLowerCase().includes(term))
      .slice(0, 4)
      .map((d) => ({ id: `deck-${d.id}`, label: d.title, to: "/flashcards", icon: Layers, group: "Flashcards" }));

    const taskMatches = tasks
      .filter((t) => t.title?.toLowerCase().includes(term))
      .slice(0, 4)
      .map((t) => ({ id: `task-${t.id}`, label: t.title, to: "/planner", icon: CalendarClock, group: "Planner" }));

    return [...noteMatches, ...deckMatches, ...taskMatches].slice(0, 8);
  }, [query, notes, decks, tasks]);
}

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { firebaseUser, profile } = useAuth();
  const title = PAGE_TITLES[pathname] ?? "StudyMate AI";
  const displayName = profile?.name || firebaseUser?.displayName || "Student";

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchResults = useSearchResults(query);
  const deadlineNotifications = useDeadlineNotifications();

  const searchBoxRef = useRef(null);
  const notifBoxRef = useRef(null);

  function goTo(to) {
    setSearchOpen(false);
    setNotifOpen(false);
    setQuery("");
    navigate(to);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-6 h-16 shrink-0">
      <button
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="md:hidden p-2 -ml-2 rounded-lg text-ink-muted hover:bg-primary-soft/60 transition-colors"
      >
        <Menu className="w-5 h-5" strokeWidth={1.75} />
      </button>

      <h1 className="font-display text-lg font-medium text-ink shrink-0">
        {title}
      </h1>

      <div
        ref={searchBoxRef}
        className="hidden sm:block relative flex-1 max-w-sm ml-4"
        onBlur={(e) => {
          if (!searchBoxRef.current?.contains(e.relatedTarget)) setSearchOpen(false);
        }}
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search notes, decks, tasks..."
            aria-label="Search your content"
            className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>

        {searchOpen && query.trim() && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-border rounded-xl shadow-lift overflow-hidden z-40">
            {searchResults.length === 0 ? (
              <p className="text-sm text-ink-faint px-3.5 py-3">No matches for "{query}"</p>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-1.5">
                {searchResults.map((result) => (
                  <li key={result.id}>
                    <button
                      onClick={() => goTo(result.to)}
                      className="w-full flex items-center gap-2.5 text-left px-3.5 py-2 text-sm text-ink hover:bg-primary-soft/60 transition-colors"
                    >
                      <result.icon size={15} strokeWidth={1.75} className="text-ink-faint shrink-0" />
                      <span className="truncate flex-1">{result.label}</span>
                      <span className="text-xs text-ink-faint shrink-0">{result.group}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div
          ref={notifBoxRef}
          className="relative"
          onBlur={(e) => {
            if (!notifBoxRef.current?.contains(e.relatedTarget)) setNotifOpen(false);
          }}
        >
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label={`Notifications${deadlineNotifications.length > 0 ? ` (${deadlineNotifications.length} upcoming)` : ""}`}
            className="relative p-2 rounded-lg text-ink-muted hover:bg-primary-soft/60 hover:text-ink transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
            {deadlineNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-hover" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-72 bg-surface border border-border rounded-xl shadow-lift overflow-hidden z-40">
              <p className="text-sm font-medium text-ink px-3.5 py-2.5 border-b border-border">
                Upcoming deadlines
              </p>
              {deadlineNotifications.length === 0 ? (
                <p className="text-sm text-ink-faint px-3.5 py-3">Nothing due in the next few days.</p>
              ) : (
                <ul className="max-h-72 overflow-y-auto py-1">
                  {deadlineNotifications.map((n) => (
                    <li key={n.id}>
                      <button
                        onClick={() => goTo("/planner")}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-primary-soft/60 transition-colors"
                      >
                        <p className="text-sm text-ink truncate">{n.label}</p>
                        <p className={`text-xs mt-0.5 ${n.overdue ? "text-red-600" : "text-ink-faint"}`}>
                          {n.overdue ? "Overdue" : `Due ${n.date}`}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/settings")}
          aria-label={`User profile: ${displayName}`}
          className="w-8 h-8 rounded-full bg-secondary-soft border border-border flex items-center justify-center text-xs font-medium text-ink hover:shadow-soft transition-shadow"
        >
          {getInitials(displayName)}
        </button>
      </div>
    </header>
  );
}
