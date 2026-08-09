import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, MailCheck } from "lucide-react";
import AuthLayout from "./components/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { validateEmail } from "./utils/validators";
import { useAuth } from "./context/useAuth";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        sent
          ? undefined
          : "Enter your email and we'll send you a reset link."
      }
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-ink font-medium hover:text-primary-hover">
            Log in
          </Link>
        </>
      }
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-center py-4"
            role="status"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary-soft mb-4">
              <MailCheck className="w-6 h-6 text-secondary-hover" strokeWidth={1.75} />
            </span>
            <p className="text-sm font-medium text-ink mb-1">Check your inbox</p>
            <p className="text-sm text-ink-muted">
              We've sent a reset link to <span className="text-ink">{email}</span>.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {formError && (
              <div
                role="alert"
                className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
              >
                <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
                {formError}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
