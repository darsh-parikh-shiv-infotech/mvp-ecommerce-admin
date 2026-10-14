import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from './utils/hooks/hooks';
import { checkAuthStatus } from './store/slices/auth/AuthThunk';
import FullLoader from './components/common/FullLoader';
import { router } from './router/Routes';

function App() {
  const { isInitializing } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Keep the app quiet until the initial auth check finishes
  if (isInitializing) {
    return <FullLoader SpinnerTitle='Loading...' />
  }
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="light"
        limit={3}
      />
    </>
  );
}

export default App;
