import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, role: userRole, loading } = useAuth();

  if (loading) return <p className="text-center py-12">Checking login...</p>;

  // ✅ if no user: redirect to correct login
  if (!user) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} />;
  }

  // ✅ Role specific protection
  if (role && role !== userRole) {
    return <Navigate to={userRole === "admin" ? "/dashboard/admin" : "/dashboard/citizen"} />;
  }

  return children;
}
