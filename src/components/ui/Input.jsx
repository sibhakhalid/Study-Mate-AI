import { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * label + error wired together via useId — every Input gets a correct,
 * unique id/htmlFor/aria-describedby pairing automatically, so no
 * feature ever has to manage that by hand (and can't get it wrong).
 *
 * error: string | undefined. Presence of a string switches to error
 * styling AND announces it via aria-describedby + role="alert" —
 * validation-ready for whatever form logic gets added later.
 */
const Input = forwardRef(
  (
    { label, error, helperText, disabled = false, className, id, ...props },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ink"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background",
            error
              ? "border-red-300 focus-visible:ring-red-300"
              : "border-border focus-visible:ring-primary",
            className
          )}
          {...props}
        />

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-600"
          >
            <AlertCircle size={13} strokeWidth={2} />
            {error}
          </p>
        ) : (
          helperText && (
            <p id={helperId} className="text-xs text-ink-faint">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
