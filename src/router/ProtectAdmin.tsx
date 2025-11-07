import type { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectAdmin: React.FC = () => {
  const user = useSelector((state: RootState) => state?.auth?.user?.token);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectAdmin;
