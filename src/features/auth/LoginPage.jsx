import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import AuthLayout from "./components/AuthLayout";
import GoogleButton from "./components/GoogleButton";
import AuthDivider from "./components/AuthDivider";
import PasswordInput from "../../components/ui/PasswordInput";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import { validateEmail, validatePassword } from "./utils/validators";
import { useAuth } from "./context/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function validate() {
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    return !next.email && !next.password;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await signIn(email, password, rememberMe);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setFormError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to keep studying where you left off."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="text-ink font-medium hover:text-primary-hover">
            Sign up
          </Link>
        </>
      }
    >
      <GoogleButton label="Continue with Google" onClick={handleGoogle} loading={googleLoading} />
      <AuthDivider />

      {formError && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4"
        >
          <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link
            to="/forgot-password"
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
