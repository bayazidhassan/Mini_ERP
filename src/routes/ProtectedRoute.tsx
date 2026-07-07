import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '../redux/hook';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'manager' | 'employee')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
