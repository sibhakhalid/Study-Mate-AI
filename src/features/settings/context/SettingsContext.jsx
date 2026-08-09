import { createContext, useCallback, useEffect, useState } from "react";
import * as settingsService from "../services/settingsService";
import { useAuth } from "../../auth/context/useAuth";

export const SettingsContext = createContext(null);

/**
 * Mounted globally in App.jsx (wrapping the whole router, including the
 * public landing/login pages), so loading must wait for a signed-in
 * user — calling GET /users/me before that would just be a guaranteed
 * 401 on every page load for a signed-out visitor. Mock mode has no
 * such concern, but the gate is harmless there too.
 */
export function SettingsProvider({ children }) {
  const { firebaseUser, initializing } = useAuth();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileResult, prefsResult, notifResult] = await Promise.all([
        settingsService.getProfile(),
        settingsService.getPreferences(),
        settingsService.getNotifications(),
      ]);
      setProfile(profileResult);
      setPreferences(prefsResult);
      setNotifications(notifResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initializing) return;
    if (firebaseUser) {
      load();
    } else {
      // Signed out: clear any previous user's data rather than leaving
      // stale profile/preferences visible.
      setProfile(null);
      setPreferences(null);
      setNotifications(null);
      setLoading(false);
    }
  }, [firebaseUser, initializing, load]);

  const saveProfile = useCallback(async (updates) => {
    const updated = await settingsService.updateProfile(updates);
    setProfile(updated);
    return updated;
  }, []);

  const savePreferences = useCallback(async (updates) => {
    const updated = await settingsService.updatePreferences(updates);
    setPreferences(updated);
    return updated;
  }, []);

  const saveNotifications = useCallback(async (updates) => {
    const updated = await settingsService.updateNotifications(updates);
    setNotifications(updated);
    return updated;
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        profile,
        preferences,
        notifications,
        loading,
        error,
        reload: load,
        saveProfile,
        savePreferences,
        saveNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
