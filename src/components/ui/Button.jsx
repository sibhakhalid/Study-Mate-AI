import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary hover:bg-primary-hover text-ink shadow-soft",
        secondary:
          "bg-secondary-soft hover:bg-secondary text-ink border border-border",
        ghost: "bg-transparent hover:bg-primary-soft/60 text-ink-muted hover:text-ink",
      },
      size: {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2.5",
        lg: "text-base px-5 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/**
 * icon: a lucide-react icon component (not an element) — rendered at the
 * correct size for the button's `size` automatically.
 * iconPosition: "left" | "right", ignored while `loading` (spinner takes its place).
 */
const Button = forwardRef(
  (
    {
      children,
      variant,
      size,
      icon: Icon,
      iconPosition = "left",
      loading = false,
      disabled = false,
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    const iconSize = size === "lg" ? 18 : size === "sm" ? 14 : 16;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonStyles({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={iconSize} strokeWidth={2} />
        ) : (
          Icon && iconPosition === "left" && (
            <Icon size={iconSize} strokeWidth={1.75} />
          )
        )}
        {children}
        {!loading && Icon && iconPosition === "right" && (
          <Icon size={iconSize} strokeWidth={1.75} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
