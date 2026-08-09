import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { NotesProvider } from "./features/notes/context/NotesContext";
import { TutorChatProvider } from "./features/tutor-chat/context/TutorChatContext";
import { QuizProvider } from "./features/quiz/context/QuizContext";
import { FlashcardsProvider } from "./features/flashcards/context/FlashcardsContext";
import { PlannerProvider } from "./features/planner/context/PlannerContext";
import { SettingsProvider } from "./features/settings/context/SettingsContext";

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <TutorChatProvider>
          <QuizProvider>
            <FlashcardsProvider>
              <PlannerProvider>
                <SettingsProvider>
                  <RouterProvider router={router} />
                </SettingsProvider>
              </PlannerProvider>
            </FlashcardsProvider>
          </QuizProvider>
        </TutorChatProvider>
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;
