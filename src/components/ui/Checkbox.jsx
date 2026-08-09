import { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Custom-styled checkbox (native input, visually hidden, styled box
 * driven by :checked via peer-*) — keeps real checkbox semantics
 * (keyboard, screen reader, form submission) while matching the design
 * system instead of the browser default.
 */
export default function Checkbox({ label, checked, onChange, error, id, ...props }) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div>
      <label htmlFor={inputId} className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={onChange}
          aria-invalid={!!error}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            "w-[18px] h-[18px] shrink-0 rounded-md border flex items-center justify-center transition-colors",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-background",
            checked ? "bg-primary border-primary" : "bg-surface border-border",
            error && !checked && "border-red-300"
          )}
        >
          {checked && <Check size={13} strokeWidth={3} className="text-ink" />}
        </span>
        <span className="text-sm text-ink-muted">{label}</span>
      </label>
    </div>
  );
}
