import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';
import {
  APP_CONFIG,
  FORM_DEFAULTS,
  OTP_VALIDATION_PATTERN,
  RESEND_OTP_TIME,
  ROUTES,
  UI_TEXT,
} from '../utils/constants/constants';
import { ChangePasswordValidation } from '../utils/validations/ChangePasswordValidation';

interface BaseChangePasswordFormProps {
  email: string;
  loading: boolean;
  submitHandler: (
    email: string,
    otp: number,
    newPassword: string,
    confirmNewPassword: string,
  ) => void;
}

interface ChangePasswordFormValues {
  otp: string[];
  newPassword: string;
  confirmNewPassword: string;
}

const BaseChangePasswordForm = ({ email, submitHandler, loading }: BaseChangePasswordFormProps) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timeLeft, setTimeLeft] = useState<number>(RESEND_OTP_TIME);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft <= 0) {
        setCanResend(true);
        return;
      }
      setTimeLeft((prev) => prev - 1);
    }, APP_CONFIG.OTP_TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [timeLeft]);
  const handleResendOtp = async () => {
    if (!canResend) return;
    setTimeLeft(RESEND_OTP_TIME);
    setCanResend(false);
  };

  const formik = useFormik<ChangePasswordFormValues>({
    initialValues: {
      otp: Array(APP_CONFIG.OTP_LENGTH).fill(FORM_DEFAULTS.EMPTY_STRING),
      newPassword: FORM_DEFAULTS.EMPTY_STRING,
      confirmNewPassword: FORM_DEFAULTS.EMPTY_STRING,
    },
    validationSchema: ChangePasswordValidation,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      const otp = Number(values.otp.join(''));
      submitHandler(email, otp, values.newPassword, values.confirmNewPassword);
    },
  });

  const otpError =
    formik.touched.otp || formik.submitCount > 0
      ? typeof formik.errors.otp === 'string'
        ? formik.errors.otp
        : undefined
      : undefined;
  const newPasswordError =
    formik.touched.newPassword || formik.submitCount > 0 ? formik.errors.newPassword : undefined;
  const confirmNewPasswordError =
    formik.touched.confirmNewPassword || formik.submitCount > 0
      ? formik.errors.confirmNewPassword
      : undefined;

  const handleOtpChange = (index: number, value: string) => {
    if (value !== '' && !/^\d$/.test(value)) return;

    const otp = [...formik.values.otp];
    otp[index] = value;
    void formik.setFieldValue('otp', otp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedOtp = event.clipboardData.getData('text').trim();
    if (!OTP_VALIDATION_PATTERN.test(pastedOtp)) return;

    void formik.setFieldValue('otp', pastedOtp.split(''));
    inputRefs.current[APP_CONFIG.OTP_LENGTH - 1]?.focus();
  };

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="shrink-0 bg-gray-200 p-2 rounded-full">
          <MdOutlineEmail color="red" size={15} />
        </div>
        <span className="uppercase font-semibold text-2xs md:text-xs leading-0 text-gray-400">
          {UI_TEXT.AUTH.OTP_STEP}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-md md:text-2xl font-bold">{UI_TEXT.AUTH.FORGOT_PASSWORD}</span>
        <span className="text-xs md:text-sm font-body">
          {UI_TEXT.AUTH.OTP_INSTRUCTION_PREFIX} {email} {UI_TEXT.AUTH.OTP_INSTRUCTION_SUFFIX}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="otp-0" className="font-medium text-md md:text-sm">
          {UI_TEXT.AUTH.OTP}
          <span className="text-red-600">{UI_TEXT.COMMON.REQUIRED_MARKER}</span>
        </label>
        <div className="flex justify-center gap-1">
          {formik.values.otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              id={`otp-${index}`}
              name={`otp[${index}]`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={APP_CONFIG.OTP_DIGIT_LENGTH}
              value={digit}
              aria-label={`${UI_TEXT.COMMON.OTP_DIGIT_LABEL_PREFIX} ${index + 1}`}
              aria-invalid={Boolean(otpError)}
              aria-describedby={otpError ? 'otp-error' : undefined}
              onBlur={formik.handleBlur}
              onChange={(event) => handleOtpChange(index, event.target.value)}
              onPaste={handleOtpPaste}
              onKeyDown={(event) => {
                if (event.key === 'Backspace' && !digit && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              className={`h-10 w-7 md:h-12 md:w-12 rounded-lg border ${otpError ? 'border-red-600' : 'border-gray-300'} bg-white text-center text-sm md:text-lg focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md`}
            />
          ))}
        </div>
        {otpError ? (
          <span id="otp-error" role="alert" className="text-sm font-normal text-red-700">
            {otpError}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="newPassword" className="font-medium text-sm">
          {UI_TEXT.AUTH.NEW_PASSWORD}
          <span className="text-red-600">{UI_TEXT.COMMON.REQUIRED_MARKER}</span>
        </label>
        <div className="relative rounded-md">
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            autoComplete="new-password"
            aria-invalid={Boolean(newPasswordError)}
            aria-describedby={newPasswordError ? 'new-password-error' : undefined}
            {...formik.getFieldProps('newPassword')}
            className={`h-10 w-full rounded-lg border bg-white px-4 py-2 text-sm md:text-md ${newPasswordError ? 'border-red-600' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md`}
            placeholder={UI_TEXT.AUTH.ENTER_NEW_PASSWORD}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((visible) => !visible)}
            aria-label={
              showNewPassword ? UI_TEXT.COMMON.HIDE_PASSWORD : UI_TEXT.COMMON.SHOW_PASSWORD
            }
            className="absolute inset-y-0 right-0 flex items-center px-4 text-red-500 hover:text-red-700"
          >
            {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
        {newPasswordError ? (
          <span id="new-password-error" role="alert" className="text-sm font-normal text-red-700">
            {newPasswordError}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmNewPassword" className="font-medium text-sm">
          {UI_TEXT.AUTH.CONFIRM_NEW_PASSWORD}
          <span className="text-red-600">{UI_TEXT.COMMON.REQUIRED_MARKER}</span>
        </label>
        <div className="relative rounded-md">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmNewPassword"
            autoComplete="new-password"
            aria-invalid={Boolean(confirmNewPasswordError)}
            aria-describedby={confirmNewPasswordError ? 'confirm-new-password-error' : undefined}
            {...formik.getFieldProps('confirmNewPassword')}
            className={`h-10 w-full rounded-lg border bg-white px-4 py-2 text-sm md:text-md ${confirmNewPasswordError ? 'border-red-600' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md`}
            placeholder={UI_TEXT.AUTH.ENTER_NEW_PASSWORD_AGAIN}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((visible) => !visible)}
            aria-label={
              showConfirmPassword ? UI_TEXT.COMMON.HIDE_PASSWORD : UI_TEXT.COMMON.SHOW_PASSWORD
            }
            className="absolute inset-y-0 right-0 flex items-center px-4 text-red-500 hover:text-red-700"
          >
            {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
        {confirmNewPasswordError ? (
          <span
            id="confirm-new-password-error"
            role="alert"
            className="text-sm font-normal text-red-700"
          >
            {confirmNewPasswordError}
          </span>
        ) : null}
      </div>
      <div className="w-full text-end">
        {canResend ? (
          <button
            className="font-medium text-sm text-red-600 hover:border-b"
            onClick={handleResendOtp}
          >
            {UI_TEXT.AUTH.RESEND_OTP}
          </button>
        ) : (
          <p className="text-sm mb-2">
            {UI_TEXT.AUTH.RESEND_OTP_PROMPT} {Math.floor(timeLeft / APP_CONFIG.SECONDS_PER_MINUTE)}
            {UI_TEXT.COMMON.TIMER_SEPARATOR}
            {timeLeft % APP_CONFIG.SECONDS_PER_MINUTE}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={`rounded-lg bg-linear-to-r from-red-700 to-red-800 p-2 font-bold text-white shadow-rose-400 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md ${loading && 'opacity-50'}`}
        disabled={loading}
      >
        {UI_TEXT.AUTH.UPDATE_PASSWORD}
      </button>
      <div className="flex justify-center">
        <Link to={ROUTES.LOGIN} className="font-medium text-sm text-red-600 hover:border-b">
          {UI_TEXT.COMMON.BACK_TO_SIGN_IN}
        </Link>
      </div>
    </form>
  );
};

export default BaseChangePasswordForm;
