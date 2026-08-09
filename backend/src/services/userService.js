import { User } from "../models/User.js";
import { Note } from "../models/Note.js";
import { Deck, Card } from "../models/Flashcard.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { PlannerTask, StudyGoal } from "../models/Planner.js";
import { TutorConversation } from "../models/TutorConversation.js";

/**
 * Just-in-time provisioning: finds the Mongo user for a Firebase UID,
 * creating it on first sight. Lives here (not in the middleware) so any
 * future script or job that needs "the user for this Firebase account"
 * — a seed script, an admin tool — gets the identical logic instead of
 * a second copy of the upsert.
 */
export async function findOrCreateUser({ uid, email, name, picture }) {
  return User.findOneAndUpdate(
    { firebaseUid: uid },
    {
      $setOnInsert: {
        firebaseUid: uid,
        email: email ?? "",
        name: name ?? (email ? email.split("@")[0] : "Student"),
        avatarUrl: picture ?? null,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

export async function updateProfile(user, updates) {
  Object.assign(user, updates);
  await user.save();
  return user;
}

export async function updatePreferences(user, updates) {
  Object.assign(user.preferences, updates);
  await user.save();
  return user.preferences;
}

export async function updateNotifications(user, updates) {
  Object.assign(user.notifications, updates);
  await user.save();
  return user.notifications;
}

/**
 * Deletes every piece of app data owned by this user, across every
 * feature collection, before removing the User document itself. Kept
 * as one function so "what does account deletion actually erase" has a
 * single, auditable answer as new features/collections are added —
 * each one just needs a line added here.
 */
export async function deleteAllUserData(userId) {
  await Promise.all([
    Note.deleteMany({ user: userId }),
    Deck.deleteMany({ user: userId }),
    Card.deleteMany({ user: userId }),
    QuizAttempt.deleteMany({ user: userId }),
    PlannerTask.deleteMany({ user: userId }),
    StudyGoal.deleteMany({ user: userId }),
    TutorConversation.deleteMany({ user: userId }),
  ]);
  await User.deleteOne({ _id: userId });
}
