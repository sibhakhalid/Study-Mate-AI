import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signOut,
} from "firebase/auth";
import { auth } from "../../../config/firebase";
import { mapFirebaseError } from "../utils/mapFirebaseError";

const googleProvider = new GoogleAuthProvider();

/**
 * `rememberMe` maps directly to Firebase's persistence modes:
 * - true  -> browserLocalPersistence: survives closing the tab/browser
 * - false -> browserSessionPersistence: cleared when the tab closes
 * Persistence is set immediately before the sign-in call, since it only
 * takes effect for the sign-in that follows it.
 */
export async function signInWithEmail(email, password, rememberMe = true) {
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (err) {
    throw new Error(mapFirebaseError(err));
  }
}

export async function signUpWithEmail(name, email, password) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // displayName isn't set by createUserWithEmailAndPassword itself —
    // without this, the token's `name` claim (which the backend's
    // attachUser middleware uses to seed the Mongo profile) would be empty.
    await updateFirebaseProfile(credential.user, { displayName: name });
    // The ID token Firebase minted at account creation was issued
    // before displayName existed, so it doesn't carry the `name` claim
    // yet. Force a refresh now — otherwise the backend's very next
    // request (creating the Mongo user record) would see no name and
    // permanently fall back to "Student" (that record is only ever
    // seeded once, on first sight).
    await credential.user.getIdToken(true);
    return credential.user;
  } catch (err) {
    throw new Error(mapFirebaseError(err));
  }
}

export async function signInWithGoogle() {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  } catch (err) {
    throw new Error(mapFirebaseError(err));
  }
}

export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { sent: true };
  } catch (err) {
    // A password-reset form that errors for unregistered emails but
    // succeeds for registered ones is an account-enumeration oracle —
    // silently treat "no such account" as success so the UI response
    // is identical either way. Every other failure (invalid email
    // format, rate limited, network error) still surfaces normally.
    if (err?.code === "auth/user-not-found") {
      return { sent: true };
    }
    throw new Error(mapFirebaseError(err));
  }
}

export async function signOutUser() {
  await signOut(auth);
}
