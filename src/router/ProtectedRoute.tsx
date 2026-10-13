import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { AuthState } from '../store/slices/auth/AuthSlice';
import { useAppSelector } from '../utils/hooks/hooks';
import FullLoader from '../components/common/FullLoader';
const ProtectedRoute = () => {
  const { isAuthenticated, loading }: AuthState = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <FullLoader SpinnerTitle='Loading...' />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
export default ProtectedRoute 