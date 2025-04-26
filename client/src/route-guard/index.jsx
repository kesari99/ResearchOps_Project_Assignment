import { Navigate, useLocation } from "react-router-dom";

const RouteGuard = ({ authenticate, element }) => {
    console.log(authenticate)
  const location = useLocation();

  if (!authenticate && location.pathname !== "/auth") {
    return <Navigate to="/auth" replace />;
  }

  if (authenticate && location.pathname === "/auth") {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default RouteGuard;
