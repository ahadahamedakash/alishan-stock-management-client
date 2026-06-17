import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

export default function ProtectedRoute({ children }) {
  // USER DATA
  const currentUser = useSelector(useCurrentUser);

  const isAuthenticated = Boolean(currentUser?.user);

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
