import { seedProfile, seedPreferences, seedNotifications } from "../data/mockProfile";
import { apiRequest, isBackendConfigured } from "../../../services/httpClient";
import { normalizeDoc } from "../../../utils/normalizeMongoDoc";

/**
 * Two implementations behind one interface — see notesService.js for
 * the full rationale.
 *
 * Backend mode note: the backend's GET /users/me returns the whole user
 * document in one call (profile + preferences + notifications
 * together), but SettingsContext calls getProfile/getPreferences/
 * getNotifications as three independent requests — a shape worth
 * preserving rather than restructuring, since it keeps this a drop-in
 * swap. The three calls do mean three GET /users/me round trips instead
 * of one; harmless (it's a cheap, cached-by-nothing-but-fast lookup),
 * and not worth a bigger context refactor to save.
 *
 * Password changes and account deletion are genuine auth operations —
 * those go straight through Firebase (and the backend's cleanup
 * endpoint) directly from AccountSection.jsx, not through here.
 */

const USE_BACKEND = isBackendConfigured;

const PROFILE_KEY = "studymate.profile";
const PREFERENCES_KEY = "studymate.preferences";
const NOTIFICATIONS_KEY = "studymate.notifications";
const LATENCY = 500;

function delay(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readOrSeed(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return { ...seed };
    }
    return JSON.parse(raw);
  } catch {
    return { ...seed };
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Profile ---

export async function getProfile() {
  if (USE_BACKEND) {
    const user = await apiRequest("/users/me");
    const doc = normalizeDoc(user);
    return { id: doc.id, name: doc.name, email: doc.email, bio: doc.bio, avatarUrl: doc.avatarUrl };
  }

  await delay(300);
  return readOrSeed(PROFILE_KEY, seedProfile);
}

export async function updateProfile(updates) {
  if (USE_BACKEND) {
    const user = await apiRequest("/users/me", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    const doc = normalizeDoc(user);
    return { id: doc.id, name: doc.name, email: doc.email, bio: doc.bio, avatarUrl: doc.avatarUrl };
  }

  await delay();
  const current = readOrSeed(PROFILE_KEY, seedProfile);
  const updated = { ...current, ...updates };
  write(PROFILE_KEY, updated);
  return updated;
}

// --- Preferences ---

export async function getPreferences() {
  if (USE_BACKEND) {
    const user = await apiRequest("/users/me");
    return user.preferences;
  }

  await delay(200);
  return readOrSeed(PREFERENCES_KEY, seedPreferences);
}

export async function updatePreferences(updates) {
  if (USE_BACKEND) {
    return apiRequest("/users/me/preferences", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  await delay(300);
  const current = readOrSeed(PREFERENCES_KEY, seedPreferences);
  const updated = { ...current, ...updates };
  write(PREFERENCES_KEY, updated);
  return updated;
}

// --- Notifications ---

export async function getNotifications() {
  if (USE_BACKEND) {
    const user = await apiRequest("/users/me");
    return user.notifications;
  }

  await delay(200);
  return readOrSeed(NOTIFICATIONS_KEY, seedNotifications);
}

export async function updateNotifications(updates) {
  if (USE_BACKEND) {
    return apiRequest("/users/me/notifications", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  await delay(300);
  const current = readOrSeed(NOTIFICATIONS_KEY, seedNotifications);
  const updated = { ...current, ...updates };
  write(NOTIFICATIONS_KEY, updated);
  return updated;
}
