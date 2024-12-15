import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../store";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = useSelector((state: AppState) => state.auth.token);
  // Redirect to "/" if already logged in
  return token ? <Navigate to="/" /> : children; 
};

export default PublicRoute;
