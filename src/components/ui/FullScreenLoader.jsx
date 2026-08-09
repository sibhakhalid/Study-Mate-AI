/**
 * Shown only once, briefly, while Firebase's onAuthStateChanged fires
 * for the first time on page load. Without this, protected routes would
 * flash their "redirect to /login" logic before Firebase has had a
 * chance to report an existing session.
 */
export default function FullScreenLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-background" role="status" aria-label="Loading">
      <div className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin" />
    </div>
  );
}
