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
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "./utils/validators";
import { useAuth } from "./context/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function validate() {
    const next = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
      terms: !agreedToTerms ? "You must agree to the terms to continue" : null,
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await signUp(name, email, password);
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
      title="Create your account"
      subtitle="Start turning your notes into mastery."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-ink font-medium hover:text-primary-hover">
            Log in
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign up with Google" onClick={handleGoogle} loading={googleLoading} />
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
          label="Full name"
          placeholder="Sibha Khalid"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
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
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <PasswordInput
          label="Confirm password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <Checkbox
          label={
            <>
              I agree to the{" "}
              <a href="#" className="text-ink underline hover:text-primary-hover">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-ink underline hover:text-primary-hover">
                Privacy Policy
              </a>
            </>
          }
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          error={errors.terms}
        />
        {errors.terms && (
          <p className="text-xs text-red-600 -mt-2">{errors.terms}</p>
        )}

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
