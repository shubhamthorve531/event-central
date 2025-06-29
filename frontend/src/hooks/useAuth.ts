import { useState } from "react";

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const login = (token: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setRole(role);
  };

  const isAuthenticated = !!token;
  const isAdmin = role === "admin";

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  return { token, role, isAuthenticated, isAdmin, login, logout };
}
