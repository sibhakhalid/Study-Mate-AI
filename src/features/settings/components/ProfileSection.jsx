import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfileSection({ profile, onSave }) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(profile.name);
    setBio(profile.bio);
  }, [profile]);

  const isDirty = name !== profile.name || bio !== profile.bio;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave({ name, bio });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (err) {
      // Without this, a failed save just silently stopped the spinner
      // with no "Saved" flash and no explanation — indistinguishable
      // from the button doing nothing at all.
      setError(err.message || "Couldn't save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card variant="default">
      <h2 className="font-display text-lg font-medium text-ink mb-5">Profile</h2>

      <div className="flex items-center gap-4 mb-6">
        <span
          className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-soft text-primary-hover font-display text-xl font-medium shrink-0"
          aria-hidden="true"
        >
          {getInitials(name || "?")}
        </span>
        <div>
          <p className="text-sm text-ink-muted">
            Avatar uses your initials for now — photo upload connects once storage is wired up.
          </p>
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-bio" className="text-sm font-medium text-ink">
            Bio
          </label>
          <textarea
            id="profile-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mt-4 max-w-md"
        >
          <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 mt-5">
        <Button variant="primary" loading={saving} disabled={!isDirty} onClick={handleSave}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
        <AnimatePresence>
          {savedFlash && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-sm text-secondary-hover"
            >
              <Check size={15} strokeWidth={2} />
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
