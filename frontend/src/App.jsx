import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";


import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TempleListPage from "./pages/TempleListPage";
import TempleDetailPage from "./pages/TempleDetailPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import NotFoundPage from "./pages/NotFoundPage";


import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />

          <main className="main-content">
            <Routes>
           
              <Route path="/" element={<Navigate to="/temples" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/temples" element={<TempleListPage />} />
              <Route path="/temples/:id" element={<TempleDetailPage />} />

              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["USER", "ADMIN", "ORGANIZER"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

             
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

           
              <Route
                path="/organizer"
                element={
                  <ProtectedRoute allowedRoles={["ORGANIZER", "ADMIN"]}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />

             
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;