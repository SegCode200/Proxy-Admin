import type { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectAdmin: React.FC = () => {
  const user = useSelector((state: RootState) => state?.auth?.user?.token);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  try {
    const token = jwtDecode(user as string) as { exp: number };
    const expirationDate = new Date(token.exp * 1000);
    if (expirationDate <= new Date()) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid token, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectAdmin;
