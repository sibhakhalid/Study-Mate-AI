export { formatRelativeTime } from "../../../utils/formatRelativeTime";

/** Notes-specific: not reused elsewhere, so it stays local to this feature. */
export function snippet(content, maxLength = 140) {
  const clean = content.replace(/\n+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trim()}...`;
}
