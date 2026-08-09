import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names and resolves conflicting Tailwind utilities
 * (e.g. cn("p-2", condition && "p-4") correctly keeps only "p-4").
 * Every component in this project should build its className with this,
 * not raw template strings — it's what makes variant props safe later.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
