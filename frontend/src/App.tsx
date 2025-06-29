import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AdminCreateEvent from "./pages/AdminCreateEvent";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute allowedRoles={["admin","user"]}><Home /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/admin/create-event"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCreateEvent />
            </ProtectedRoute>
          }
        />

        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
