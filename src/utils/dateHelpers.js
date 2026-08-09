/** Shared date primitives. dateKey/addDays moved here once Progress
 * needed them too (previously lived only in Planner's dateHelpers).
 * Calendar-grid-specific math (week/month layout) stays in Planner,
 * since nothing else needs it. */

export function dateKey(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
