import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./env.js";

/**
 * The frontend authenticates directly against Firebase (email/password
 * and Google sign-in happen entirely client-side via the Firebase SDK —
 * this backend never sees a password). Every authenticated request then
 * carries a Firebase ID token, which this Admin SDK instance verifies.
 * `getApps().length` guard prevents re-initializing on hot reload.
 */
const firebaseApp =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    }),
  });

export const firebaseAuth = getAuth(firebaseApp);
