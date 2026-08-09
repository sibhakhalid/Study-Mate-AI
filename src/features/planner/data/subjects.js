/** Same subject vocabulary as Notes/Quiz/Flashcards, kept locally since
 * sharing the literal array across features would be content coupling,
 * not logic reuse — unlike formatRelativeTime, this isn't a shared
 * behavior, it's each feature's own list that happens to overlap. */
export const subjects = [
  { id: "biology", label: "Biology", badgeVariant: "primary" },
  { id: "math", label: "Math", badgeVariant: "secondary" },
  { id: "history", label: "History", badgeVariant: "accent" },
  { id: "cs", label: "CS", badgeVariant: "neutral" },
  { id: "general", label: "General", badgeVariant: "neutral" },
];

export function getSubject(id) {
  return subjects.find((s) => s.id === id) ?? subjects[subjects.length - 1];
}
