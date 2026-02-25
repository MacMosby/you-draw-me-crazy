import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSessionStore } from "../state/sessionStore";

export default function ProtectedRoute() {
  const isAuthed = useSessionStore((s) => !!s.user); // or !!s.accessToken
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
