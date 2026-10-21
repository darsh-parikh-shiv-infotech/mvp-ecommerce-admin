import { useState } from 'react';
import { LuShoppingCart } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import { changePassword, forgotPassword } from '../../store/slices/auth/AuthThunk';
import { clearAuthError } from '../../store/slices/auth/authSlice';
import BaseForgotPasswordForm from '../../components/BaseForgotPasswordForm';
import BaseChangePasswordForm from '../../components/BaseChangePasswordForm';
import BaseAppInfoAuth from '../../components/BaseAppInfoAuth';
import {
  AUTH_ERROR_MESSAGES,
  FORM_DEFAULTS,
  ROUTES,
  UI_TEXT,
} from '../../utils/constants/constants';

const ResetPasswordPage = () => {
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [changePasswordEmail, setChangePasswordEmail] = useState<string>(
    FORM_DEFAULTS.EMPTY_STRING,
  );
  const [step, setStep] = useState<1 | 2>(1);
  const forgotPasswordHandler = async (email: string) => {
    const result = await dispatch(forgotPassword({ email }));

    if (forgotPassword.fulfilled.match(result)) {
      setChangePasswordEmail(email);
      setStep(2);
      return;
    }
    if (forgotPassword.rejected.match(result)) {
      toast.error(
        result.payload?.message ??
          result.error.message ??
          AUTH_ERROR_MESSAGES.FORGOT_PASSWORD_FAILED,
      );
      dispatch(clearAuthError());
    }
    return;
  };
  const resendOtpHandler = async () => {
    const result = await dispatch(forgotPassword({ email: changePasswordEmail }));
    if (forgotPassword.fulfilled.match(result)) {
      toast.success(result.payload.message || UI_TEXT.AUTH.OTP_RESENT);
      return true;
    }
    toast.error(
      result.payload?.message ?? result.error.message ?? AUTH_ERROR_MESSAGES.FORGOT_PASSWORD_FAILED,
    );
    return false;
  };
  const resetPasswordHandler = async (
    email: string,
    otp: number,
    newPassword: string,
    confirmPassword: string,
  ) => {
    const result = await dispatch(changePassword({ email, otp, newPassword, confirmPassword }));

    if (changePassword.fulfilled.match(result)) {
      setChangePasswordEmail(FORM_DEFAULTS.EMPTY_STRING);
      return navigate(ROUTES.LOGIN);
    }
    if (changePassword.rejected.match(result)) {
      toast.error(
        result.payload?.message ??
          result.error.message ??
          AUTH_ERROR_MESSAGES.CHANGE_PASSWORD_FAILED,
      );
      dispatch(clearAuthError());
    }

    return;
  };
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
            <div className="flex flex-row gap-2">
              <div className="w-full bg-neutral-quaternary rounded-full h-2">
                {step >= 1 && <div className="bg-red-700 w-full h-2 rounded-full"></div>}
              </div>
              <div className="w-full bg-neutral-quaternary rounded-full h-2">
                {step >= 2 && <div className="bg-red-700 w-full h-2 rounded-full"></div>}
              </div>
            </div>

            {step === 1 && (
              <BaseForgotPasswordForm loading={loading} submitHandler={forgotPasswordHandler} />
            )}
            {step === 2 && changePasswordEmail.length > 0 && (
              <BaseChangePasswordForm
                loading={loading}
                email={changePasswordEmail}
                submitHandler={resetPasswordHandler}
                resendHandler={resendOtpHandler}
              />
            )}
          </div>
        </div>

        {/* App Info */}
        <BaseAppInfoAuth />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
