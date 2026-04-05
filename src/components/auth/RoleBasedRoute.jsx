import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

export default function RoleBasedRoute({ allowedRoles = [], children }) {
  const currentUser = useSelector(useCurrentUser);

  const role = currentUser?.user?.role;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
