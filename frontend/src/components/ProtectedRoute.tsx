import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { type JSX } from "react";

export function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role ?? "")) return <Navigate to="/" />;

  return children;
}
