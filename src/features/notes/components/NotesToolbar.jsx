import { Link } from "react-router-dom";
import { Search, LayoutGrid, List, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";

const FILTERS = [
  { value: "all", label: "All notes" },
  { value: "favorites", label: "Favorites" },
];

const SORTS = [
  { value: "updated", label: "Recently updated" },
  { value: "title", label: "Title A–Z" },
  { value: "oldest", label: "Oldest first" },
];

export default function NotesToolbar({
  searchValue,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" strokeWidth={1.75} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes..."
          aria-label="Search notes"
          className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <label className="sr-only" htmlFor="notes-filter">Filter notes</label>
        <select
          id="notes-filter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="notes-sort">Sort notes</label>
        <select
          id="notes-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <div
          role="group"
          aria-label="View"
          className="flex items-center bg-surface border border-border rounded-xl p-1"
        >
          <button
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              view === "grid" ? "bg-primary-soft text-ink" : "text-ink-faint hover:text-ink-muted"
            )}
          >
            <LayoutGrid size={16} strokeWidth={1.75} />
          </button>
          <button
            onClick={() => onViewChange("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              view === "list" ? "bg-primary-soft text-ink" : "text-ink-faint hover:text-ink-muted"
            )}
          >
            <List size={16} strokeWidth={1.75} />
          </button>
        </div>

        <Link to="/notes/new">
          <Button variant="primary" icon={Plus}>New note</Button>
        </Link>
      </div>
    </div>
  );
}
