import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '../ui/loading-spinner';
import { isTokenExpired } from '../utils/tokenUtils';
import { TokenService } from '../services/token.service';

interface AuthRouteProps {
  type: 'public' | 'protected';
  redirectTo?: string;
}

const AuthRoute = ({ type, redirectTo }: AuthRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = TokenService.getAccessToken();
    setIsAuthenticated(!!token && !isTokenExpired(token));
    setIsChecking(false);
  }, [location]);

  if (isChecking) return <LoadingSpinner />;

  if (type === 'protected' && !isAuthenticated) {
    return <Navigate to={redirectTo || '/login'} replace />;
  }

  if (type === 'public' && isAuthenticated) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;