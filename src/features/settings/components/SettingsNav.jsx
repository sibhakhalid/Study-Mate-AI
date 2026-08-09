import { User, ShieldCheck, SlidersHorizontal, Bell } from "lucide-react";
import { cn } from "../../../utils/cn";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account & Security", icon: ShieldCheck },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsNav({ active, onChange }) {
  return (
    <nav aria-label="Settings sections" className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => onChange(section.id)}
          aria-current={active === section.id ? "page" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0",
            active === section.id
              ? "bg-primary-soft text-ink"
              : "text-ink-muted hover:bg-primary-soft/50 hover:text-ink"
          )}
        >
          <section.icon size={16} strokeWidth={1.75} />
          {section.label}
        </button>
      ))}
    </nav>
  );
}
