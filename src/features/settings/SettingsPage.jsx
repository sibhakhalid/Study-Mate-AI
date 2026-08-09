import { useState } from "react";
import { useSettings } from "./hooks/useSettings";
import SettingsNav from "./components/SettingsNav";
import ProfileSection from "./components/ProfileSection";
import AccountSection from "./components/AccountSection";
import PreferencesSection from "./components/PreferencesSection";
import NotificationsSection from "./components/NotificationsSection";
import { SettingsLoadingState, SettingsErrorState } from "./components/SettingsStates";

export default function SettingsPage() {
  const {
    profile,
    preferences,
    notifications,
    loading,
    error,
    reload,
    saveProfile,
    savePreferences,
    saveNotifications,
  } = useSettings();

  const [activeSection, setActiveSection] = useState("profile");

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-medium text-ink">Settings</h1>
        <SettingsLoadingState />
      </div>
    );
  }

  if (error) {
    return <SettingsErrorState message={error} onRetry={reload} />;
  }

  // Defensive guard: `loading`/`error` cover the expected cases, but
  // profile can still legitimately be null for a moment — e.g. right
  // after sign-out, before ProtectedRoute finishes redirecting away.
  // Rather than rely on exact React re-render ordering across three
  // separate context providers to guarantee this is never hit, fail
  // safe with the loading state instead of crashing on profile.email.
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-medium text-ink">Settings</h1>
        <SettingsLoadingState />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-medium text-ink">Settings</h1>

      <div className="grid sm:grid-cols-[200px_1fr] gap-6">
        <SettingsNav active={activeSection} onChange={setActiveSection} />

        <div>
          {activeSection === "profile" && (
            <ProfileSection profile={profile} onSave={saveProfile} />
          )}
          {activeSection === "account" && (
            <AccountSection email={profile.email} />
          )}
          {activeSection === "preferences" && (
            <PreferencesSection preferences={preferences} onSave={savePreferences} />
          )}
          {activeSection === "notifications" && (
            <NotificationsSection notifications={notifications} onSave={saveNotifications} />
          )}
        </div>
      </div>
    </div>
  );
}
