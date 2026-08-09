import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Logo from "../../../components/ui/Logo";
import { useAuth } from "../context/useAuth";

/**
 * Shared shell for Login / Signup / Forgot Password.
 * Centered card, brand-consistent with the landing page (same tokens,
 * same Logo component), single entrance animation so each page doesn't
 * redefine it.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  const { configError } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <Link
            to="/"
            className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            Back to home
          </Link>
        </div>

        {configError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 mb-5"
          >
            <AlertTriangle size={16} strokeWidth={1.75} className="shrink-0 mt-0.5" />
            <span>{configError}</span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-surface border border-border rounded-2xl shadow-lift p-7 sm:p-8"
        >
          <h1 className="font-display text-2xl font-medium text-ink mb-1.5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-ink-muted mb-6">{subtitle}</p>
          )}

          {children}
        </motion.div>

        {footer && (
          <p className="text-center text-sm text-ink-muted mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}
