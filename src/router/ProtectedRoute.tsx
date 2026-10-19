import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { AuthState } from '../store/slices/auth/authSlice';
import { useAppSelector } from '../utils/hooks/hooks';
import FullLoader from '../components/common/FullLoader';
import { ROUTES, UI_TEXT } from '../utils/constants/constants';
const ProtectedRoute = () => {
  const { isAuthenticated, loading }: AuthState = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <FullLoader SpinnerTitle={UI_TEXT.COMMON.LOADING} />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
