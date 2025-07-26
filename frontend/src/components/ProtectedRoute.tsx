// frontend/src/components/ProtectedRoute.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/checkTokenExpiry";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // ✅ Updated key

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("accessToken");
      setIsValid(false);
    } else {
      setIsValid(true);
    }

    setChecking(false);
  }, []);

  if (checking) {
    return <div>Loading...</div>; // Spinner can be added later
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
