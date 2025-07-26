// src/App.tsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import axiosInstance from "./utils/axiosInstance";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Optional: store user data

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // set login state if token exists

    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        const response = await axiosInstance.get("/api/user/profile", {
          withCredentials: true,
        });

        if (response.status === 200) {
          console.log("✅ User Data:", response.data);
          setUserData(response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔁 Redirect root to /home or /login */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
        />

        {/* 🔒 Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
