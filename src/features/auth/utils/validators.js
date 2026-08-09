/**
 * Shared validation rules for Login/Signup/Forgot Password.
 * Centralized so all 3 forms report errors identically — a beginner
 * mistake this avoids is writing three slightly different email regexes
 * that disagree with each other.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
  if (!value.trim()) return "Email is required";
  if (!EMAIL_RE.test(value)) return "Enter a valid email address";
  return null;
}

export function validatePassword(value) {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validateName(value) {
  if (!value.trim()) return "Name is required";
  if (value.trim().length < 2) return "Name is too short";
  return null;
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords don't match";
  return null;
}
