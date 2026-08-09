import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, AlertCircle, ShieldAlert } from "lucide-react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { useAuth } from "../../auth/context/useAuth";
import { apiRequest } from "../../../services/httpClient";
import { mapFirebaseError } from "../../auth/utils/mapFirebaseError";

export default function AccountSection({ email }) {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();

  // Password sign-in is the only method Firebase lets an app change a
  // password for directly — Google-only accounts have no password to
  // change, so the form is hidden rather than shown broken.
  const hasPasswordProvider = firebaseUser?.providerData?.some(
    (p) => p.providerId === "password"
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  function validate() {
    const next = {
      currentPassword: !currentPassword ? "Enter your current password" : null,
      newPassword: newPassword.length < 8 ? "New password must be at least 8 characters" : null,
      confirmPassword: confirmPassword !== newPassword ? "Passwords don't match" : null,
    };
    setErrors(next);
    return !next.currentPassword && !next.newPassword && !next.confirmPassword;
  }

  async function handleChangePassword() {
    setFormError(null);
    if (!validate()) return;
    setSaving(true);
    try {
      // Firebase requires a recent sign-in before allowing a password
      // change — reauthenticating with the current password satisfies
      // that without forcing a full logout/login round trip.
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (err) {
      setFormError(mapFirebaseError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError(null);
    try {
      // Order matters: clean up our own data first while the ID token
      // is still valid, then delete the Firebase account itself — doing
      // it in the other order would leave orphaned Mongo data behind
      // with no way to authenticate and retry the cleanup.
      await apiRequest("/users/me", { method: "DELETE" });
      await deleteUser(firebaseUser);
      setDeleteModalOpen(false);
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(mapFirebaseError(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card variant="default">
        <h2 className="font-display text-lg font-medium text-ink mb-5">Account</h2>
        <div className="max-w-md">
          <Input
            label="Email"
            value={email}
            disabled
            helperText="Managed by your sign-in provider and can't be edited here."
          />
        </div>
      </Card>

      <Card variant="default">
        <h2 className="font-display text-lg font-medium text-ink mb-1.5">Change password</h2>
        <p className="text-sm text-ink-muted mb-5">
          Choose a strong password you're not using elsewhere.
        </p>

        {!hasPasswordProvider ? (
          <div className="flex items-start gap-2.5 text-sm text-ink-muted bg-primary-soft/40 border border-border rounded-xl px-3.5 py-3 max-w-md">
            <ShieldAlert size={16} strokeWidth={1.75} className="shrink-0 mt-0.5" />
            <span>
              You signed in with Google, so there's no StudyMate password to change. Manage your
              password through your Google Account instead.
            </span>
          </div>
        ) : (
          <>
            {formError && (
              <div
                role="alert"
                className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4 max-w-md"
              >
                <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
                {formError}
              </div>
            )}

            <div className="space-y-4 max-w-md">
              <PasswordInput
                label="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                error={errors.currentPassword}
              />
              <PasswordInput
                label="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={errors.newPassword}
              />
              <PasswordInput
                label="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />
            </div>

            <div className="flex items-center gap-3 mt-5">
              <Button variant="primary" loading={saving} onClick={handleChangePassword}>
                {saving ? "Updating..." : "Update password"}
              </Button>
              {savedFlash && (
                <span className="text-sm text-secondary-hover">Password updated</span>
              )}
            </div>
          </>
        )}
      </Card>

      <Card variant="default" className="border-red-200">
        <h2 className="font-display text-lg font-medium text-ink mb-1.5">Danger zone</h2>
        <p className="text-sm text-ink-muted mb-4">
          Permanently delete your account and all associated data. This can't be undone.
        </p>
        <Button variant="secondary" icon={AlertTriangle} onClick={() => setDeleteModalOpen(true)}>
          Delete account
        </Button>
      </Card>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Modal.Header onClose={() => setDeleteModalOpen(false)}>Delete your account?</Modal.Header>
        <Modal.Body className="space-y-3">
          <p>This permanently deletes your notes, quizzes, flashcards, and study history. This can't be undone.</p>
          {deleteError && (
            <div
              role="alert"
              className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
            >
              <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
              {deleteError}
            </div>
          )}
          <Input
            label='Type "DELETE" to confirm'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button
            variant="primary"
            loading={deleting}
            disabled={confirmText !== "DELETE"}
            onClick={handleDeleteAccount}
          >
            {deleting ? "Deleting..." : "Delete account"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
