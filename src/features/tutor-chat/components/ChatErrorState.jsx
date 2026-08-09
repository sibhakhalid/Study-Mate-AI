import { AlertCircle, RotateCw } from "lucide-react";

export default function ChatErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600"
    >
      <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        onClick={onRetry}
        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 shrink-0"
      >
        <RotateCw size={12} strokeWidth={2} />
        Retry
      </button>
    </div>
  );
}
