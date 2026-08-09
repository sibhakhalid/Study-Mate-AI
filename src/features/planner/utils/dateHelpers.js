/** Calendar math for Day/Week/Month views, local to planner (nothing
 * else needs week/month grid layout). dateKey/addDays are shared
 * primitives (now also used by Progress), imported here and re-exported
 * so existing planner imports of them don't break. */

import { dateKey, addDays } from "../../../utils/dateHelpers";
export { dateKey, addDays };

export function isSameDay(a, b) {
  return dateKey(a) === dateKey(b);
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

export function startOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay()); // Sunday-based, consistent with the rest of the app
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(date) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Returns full calendar weeks (each 7 days) covering the month that
 * `date` falls in, padded with leading/trailing days from adjacent
 * months so every week row is complete. */
export function getMonthGrid(date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const gridStart = startOfWeek(firstOfMonth);

  const weeks = [];
  let cursor = gridStart;
  // 6 weeks is always enough to cover any month's full grid
  for (let w = 0; w < 6; w++) {
    const week = Array.from({ length: 7 }, (_, i) => addDays(cursor, i));
    weeks.push(week);
    cursor = addDays(cursor, 7);
    // stop once we've covered the month and started a new week fully outside it
    if (cursor.getMonth() !== date.getMonth() && week[6].getMonth() !== date.getMonth()) break;
  }
  return weeks;
}

export function formatDayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function formatWeekRangeLabel(date) {
  const days = getWeekDays(date);
  const start = days[0];
  const end = days[6];
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString(undefined, sameMonth ? { day: "numeric" } : { month: "short", day: "numeric" });
  return `${startLabel} – ${endLabel}`;
}

export function formatMonthYear(date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
