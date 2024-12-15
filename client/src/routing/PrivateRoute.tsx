import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../store";

const PrivateRoutes = () => {
  const token = useSelector((state: AppState) => state.auth.token);

  // If no token, redirect to login; otherwise, render the children
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;