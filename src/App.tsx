import { RouterProvider } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from './utils/hooks/hooks';
import { checkAuthStatus } from './store/slices/auth/AuthThunk';
import FullLoader from './components/common/FullLoader';
import { router } from './router/Routes';
import { APP_CONFIG, TOAST_CONFIG, UI_TEXT } from './utils/constants/constants';

function App() {
  const { isInitializing } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Keep the app quiet until the initial auth check finishes
  if (isInitializing) {
    return <FullLoader SpinnerTitle={UI_TEXT.COMMON.LOADING} />;
  }
  return (
    <>
      <Suspense fallback={<FullLoader SpinnerTitle={UI_TEXT.COMMON.LOADING} />}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer
        position={TOAST_CONFIG.POSITION}
        autoClose={APP_CONFIG.TOAST_AUTO_CLOSE_MS}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme={TOAST_CONFIG.THEME}
        limit={APP_CONFIG.TOAST_LIMIT}
      />
    </>
  );
}

export default App;
