/**
 * Skeleton matches NoteCard's actual proportions (title, 3-line body,
 * tag row) so the loading -> loaded transition doesn't visually jump.
 */
export default function NotesSkeleton({ view = "grid", count = 6 }) {
  if (view === "list") {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Loading notes">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-[60px] bg-surface border border-border rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-busy="true"
      aria-label="Loading notes"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-2xl p-6 animate-pulse">
          <div className="h-4 bg-border rounded-full w-3/4 mb-3" />
          <div className="space-y-2 mb-4">
            <div className="h-2.5 bg-border rounded-full w-full" />
            <div className="h-2.5 bg-border rounded-full w-full" />
            <div className="h-2.5 bg-border rounded-full w-2/3" />
          </div>
          <div className="h-5 bg-border rounded-full w-16" />
        </div>
      ))}
    </div>
  );
}
