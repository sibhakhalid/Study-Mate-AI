import { createContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firebaseConfigError } from "../../../config/firebase";
import { apiRequest } from "../../../services/httpClient";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

/**
 * Single source of truth for "who is signed in." Two layers of state:
 *
 * - `firebaseUser`: the raw Firebase user object (uid, email, displayName,
 *   getIdToken()) — this is identity, and it's what ProtectedRoute checks.
 * - `profile`: our own Mongo-backed profile (bio, preferences,
 *   notifications) fetched from the backend once firebaseUser exists.
 *   Fetching it *is* "user synchronization" — the GET hits attachUser
 *   middleware server-side, which creates the Mongo document on first
 *   login if it doesn't exist yet, then returns it.
 *
 * `initializing` covers the brief async gap before Firebase reports
 * whether a session already exists (e.g. from a previous visit) — every
 * route decision waits for this to resolve so a signed-in user never
 * flashes the login page on refresh.
 *
 * `configError` is non-null when Firebase env vars are missing (see
 * config/firebase.js) — the login/signup pages surface it directly
 * instead of every auth action failing with a confusing SDK error.
 */
export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const syncProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await apiRequest("/users/me");
      setProfile(data);
      return data;
    } catch (err) {
      setProfileError(err.message);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      // Firebase isn't configured — nothing to subscribe to. Resolve
      // immediately so the app renders (as signed-out) instead of
      // hanging on the loading screen forever.
      setInitializing(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await syncProfile();
      } else {
        setProfile(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, [syncProfile]);

  function assertConfigured() {
    if (!auth) throw new Error(firebaseConfigError);
  }

  async function signIn(email, password, rememberMe) {
    assertConfigured();
    await authService.signInWithEmail(email, password, rememberMe);
    // No need to call syncProfile() here — onAuthStateChanged fires
    // automatically as soon as sign-in succeeds and does it for us.
  }

  async function signUp(name, email, password) {
    assertConfigured();
    await authService.signUpWithEmail(name, email, password);
    // onAuthStateChanged already fired by this point (it triggers as
    // soon as the account is created, before displayName is set), so
    // firebaseUser in state still has a null displayName — Firebase
    // doesn't emit a second auth-state event for updateProfile calls.
    // Refresh explicitly so the UI shows the real name immediately, and
    // re-sync the backend profile now that the ID token carries it.
    if (auth.currentUser) {
      setFirebaseUser({ ...auth.currentUser });
      await syncProfile();
    }
  }

  async function signInWithGoogle() {
    assertConfigured();
    await authService.signInWithGoogle();
  }

  async function resetPassword(email) {
    assertConfigured();
    await authService.sendPasswordReset(email);
  }

  async function signOutUser() {
    if (!auth) return;
    await authService.signOutUser();
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        initializing,
        profileLoading,
        profileError,
        configError: firebaseConfigError,
        isAuthenticated: Boolean(firebaseUser),
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        signOutUser,
        syncProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
