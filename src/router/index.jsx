import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import PublicOnlyRoute from "../features/auth/components/PublicOnlyRoute";
import LandingPage from "../features/landing/LandingPage";
import LoginPage from "../features/auth/LoginPage";
import SignupPage from "../features/auth/SignupPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import NotesPage from "../features/notes/NotesPage";
import NoteEditorPage from "../features/notes/NoteEditorPage";
import AiTutorPage from "../features/tutor-chat/AiTutorPage";
import QuizPage from "../features/quiz/QuizPage";
import FlashcardsPage from "../features/flashcards/FlashcardsPage";
import PlannerPage from "../features/planner/PlannerPage";
import ProgressPage from "../features/progress/ProgressPage";
import SettingsPage from "../features/settings/SettingsPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicOnlyRoute>
        <SignupPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicOnlyRoute>
        <ForgotPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  {
    // Pathless layout route: wraps the children below in AppLayout
    // without claiming "/" itself, since the landing page owns that.
    // ProtectedRoute wraps the whole layout rather than each child, so
    // a new page added under here is automatically guarded just by
    // being nested here — there's no per-route auth checklist to forget.
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "notes", element: <NotesPage /> },
      { path: "notes/new", element: <NoteEditorPage /> },
      { path: "notes/:id", element: <NoteEditorPage /> },
      { path: "ai-tutor", element: <AiTutorPage /> },
      { path: "quiz", element: <QuizPage /> },
      { path: "flashcards", element: <FlashcardsPage /> },
      { path: "planner", element: <PlannerPage /> },
      { path: "progress", element: <ProgressPage /> },
      { path: "settings", element: <SettingsPage /> },
      // Unknown paths land on the dashboard rather than a blank screen
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

