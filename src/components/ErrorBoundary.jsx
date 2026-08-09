import { Component } from "react";

/**
 * Last line of defense: if anything in the tree throws during render
 * (a bad prop, an unexpected null, a third-party library issue), the
 * user sees a recoverable message instead of a permanently blank page
 * with nothing but a console error. Class component because error
 * boundaries aren't expressible as hooks in React yet.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Unhandled render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <div className="max-w-sm text-center">
            <h1 className="font-display text-xl font-medium text-ink mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-ink-muted mb-5">
              {this.state.error?.message || "The app hit an unexpected error."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-primary text-ink text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
