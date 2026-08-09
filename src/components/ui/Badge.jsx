import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeStyles = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-medium px-2.5 py-1",
  {
    variants: {
      variant: {
        primary: "bg-primary-soft text-ink",
        secondary: "bg-secondary-soft text-ink",
        accent: "bg-accent-soft text-ink",
        neutral: "bg-border/60 text-ink-muted",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export default function Badge({ variant, icon: Icon, children, className }) {
  return (
    <span className={cn(badgeStyles({ variant }), className)}>
      {Icon && <Icon size={12} strokeWidth={2} />}
      {children}
    </span>
  );
}
