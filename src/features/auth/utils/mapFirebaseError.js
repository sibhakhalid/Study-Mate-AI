/**
 * Firebase throws errors like `auth/wrong-password` — technically
 * correct, useless to show a student. This is the single place that
 * translates codes into copy matching the rest of the app's tone.
 */
const MESSAGES = {
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-disabled": "This account has been disabled. Contact support if this seems wrong.",
  // Deliberately identical to auth/wrong-password and auth/invalid-credential
  // below: a login form that says "no account with that email" vs.
  // "wrong password" lets anyone enumerate which emails have accounts
  // on StudyMate just by trying them. One generic message for all three
  // closes that off — see also authService.sendPasswordReset, which
  // applies the same principle to the "forgot password" flow.
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists. Try logging in instead.",
  "auth/weak-password": "Password must be at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
  "auth/popup-blocked": "Your browser blocked the sign-in popup. Please allow popups and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/requires-recent-login": "Please log in again to complete this action.",
  "auth/account-exists-with-different-credential":
    "An account already exists with this email using a different sign-in method.",
};

export function mapFirebaseError(err) {
  const code = err?.code || "";
  return MESSAGES[code] || err?.message || "Something went wrong. Please try again.";
}
