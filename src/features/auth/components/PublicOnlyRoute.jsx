import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import FullScreenLoader from "../../../components/ui/FullScreenLoader";

export default function PublicOnlyRoute({ children }) {
  const { firebaseUser, initializing } = useAuth();

  if (initializing) return <FullScreenLoader />;

  if (firebaseUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
