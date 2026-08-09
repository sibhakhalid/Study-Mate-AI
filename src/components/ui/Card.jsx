import { useMemo } from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const cardStyles = cva("rounded-2xl border p-6", {
  variants: {
    variant: {
      // Standard content container — the default everywhere
      default: "bg-surface border-border shadow-soft",
      // For highlighting a feature/callout — accent tint, no shadow needed,
      // the color does the work
      feature: "bg-primary-soft border-transparent",
      // Clickable cards (e.g. a flashcard deck, a quiz in a list) —
      // hover lift signals affordance
      interactive:
        "bg-surface border-border shadow-soft hover:shadow-lift transition-shadow cursor-pointer",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Plain <div> for default/feature. For `interactive`, renders as a real
 * <button> when `onClick` is passed (so it's keyboard-focusable and
 * announces as a button to screen readers) — not a div with a click handler.
 */
export default function Card({
  children,
  variant = "default",
  onClick,
  className,
  as,
  ...props
}) {
  const isInteractive = variant === "interactive";
  const Component = as ?? (isInteractive && onClick ? "button" : "div");

  // motion.div/motion.button etc. only exist for plain HTML tags. For a
  // custom component (e.g. React Router's Link), framer-motion needs its
  // motion() factory instead — motion[Component] would silently be
  // undefined and previously fell back to div, dropping the real element.
  // Memoized on Component so we don't rewrap (and remount) every render.
  const MotionComponent = useMemo(
    () => (typeof Component === "string" ? motion[Component] : motion(Component)),
    [Component]
  );

  return (
    <MotionComponent
      onClick={onClick}
      whileHover={isInteractive ? { y: -2 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        cardStyles({ variant }),
        isInteractive && "text-left w-full",
        className
      )}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
