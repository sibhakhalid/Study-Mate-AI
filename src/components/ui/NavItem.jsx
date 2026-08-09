import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

/**
 * Single sidebar nav entry. Active state comes from NavLink itself
 * (isActive render prop) — no manual route-matching logic needed here
 * or anywhere else, which is what keeps this correct as routes grow.
 */
export default function NavItem({ to, icon: Icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
          "focus-visible:outline-none",
          isActive
            ? "bg-primary-soft text-ink"
            : "text-ink-muted hover:bg-primary-soft/60 hover:text-ink"
        )
      }
    >
      <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
      <span>{label}</span>
    </NavLink>
  );
}
