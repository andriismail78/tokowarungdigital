import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  console.log("🛡 ProtectedRoute:", { user, role, loading });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("➡️ Redirect to /login (no user)");
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    console.log("⛔ Role not allowed:", role);

    if (role === "owner") {
      return <Navigate to="/owner/dashboard" replace />;
    }

    if (role === "kasir") {
      return <Navigate to="/dashboard/kasir" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
