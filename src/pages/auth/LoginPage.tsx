import '../../assets/css/Login.css';
import { LuShoppingCart } from 'react-icons/lu';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import { checkAuthStatus, loginUser } from '../../store/slices/auth/AuthThunk';
import { clearAuthError } from '../../store/slices/auth/authSlice';
import BaseLoginForm from '../../components/BaseLoginForm';
import BaseAppInfoAuth from '../../components/BaseAppInfoAuth';
import { AUTH_ERROR_MESSAGES, ROUTES, UI_TEXT } from '../../utils/constants/constants';

const LoginPage = () => {
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submitHandler = async (email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const authStatusResult = await await dispatch(checkAuthStatus())
      if (checkAuthStatus.fulfilled.match(authStatusResult)) {
        return navigate(ROUTES.HOME);
      } else if (checkAuthStatus.rejected.match(authStatusResult)) {
        toast.error(authStatusResult.payload?.message ?? authStatusResult.error.message ?? AUTH_ERROR_MESSAGES.LOGIN_FAILED);
        dispatch(clearAuthError());
      }
    }
    if (loginUser.rejected.match(result)) {
      toast.error(result.payload?.message ?? result.error.message ?? AUTH_ERROR_MESSAGES.LOGIN_FAILED);
      dispatch(clearAuthError());
    }

    return;
  };

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} />;
  }
  return (
    <div className="w-full h-dvh overflow-hidden bg-red-100">
      <div className="w-full h-full flex flex-col md:flex-row px-4 md:px-12">
        {/* Left Login Card */}
        <div className="w-full md:w-[40%] h-full flex items-center">
          <div className="w-full flex flex-col gap-7 p-4 md:p-12 rounded-lg shadow-lg bg-red-50">
            <div className="w-full flex flex-row items-center gap-3">
              <div className="flex items-center px-2 py-2 rounded-base bg-red-700 transform transition-all hover:scale-110 hover:-rotate-3 duration-300 ease-in-out ">
                <LuShoppingCart className="shrink-0" size={25} color={'white'} />
              </div>
              <span className="font-bold text-lg md:text-xl">{UI_TEXT.COMMON.ADMIN_SHOP}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl md:text-3xl">{UI_TEXT.AUTH.SIGN_IN}</span>
              <span className="text-sm md:text-md text-gray-500">
                {UI_TEXT.AUTH.AUTH_DASHBOARD_DESCRIPTION}
              </span>
            </div>

            {/* Login Form */}
            <BaseLoginForm loading={loading} onSubmit={submitHandler} />
          </div>
        </div>

        {/* App Info */}
        <BaseAppInfoAuth />
      </div>
    </div>
  );
};

export default LoginPage;
