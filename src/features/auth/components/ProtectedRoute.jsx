import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import FullScreenLoader from "../../../components/ui/FullScreenLoader";

export default function ProtectedRoute({ children }) {
  const { firebaseUser, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <FullScreenLoader />;

  if (!firebaseUser) {
    // Preserves where the user was headed so a future enhancement (post-login
    // redirect back to the original page) only needs to read location.state.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
