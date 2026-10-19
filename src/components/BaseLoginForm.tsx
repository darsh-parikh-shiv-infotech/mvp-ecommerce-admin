import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useFormik } from 'formik';
import { LoginValidationSchema } from '../utils/validations/LoginValiation';
import { FORM_DEFAULTS, ROUTES, UI_TEXT } from '../utils/constants/constants';

export interface LoginFormValues {
  email: string;
  password: string;
}
interface BaseLoginFormProp {
  loading: boolean;
  onSubmit: (email: string, password: string) => void;
}

const BaseLoginForm = ({ loading: isLoading, onSubmit }: BaseLoginFormProp) => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: FORM_DEFAULTS.EMPTY_STRING,
      password: FORM_DEFAULTS.EMPTY_STRING,
    },
    validationSchema: LoginValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: LoginFormValues) => {
      onSubmit(values.email, values.password);
    },
  });

  const emailError =
    formik.touched.email || formik.submitCount > 0 ? formik.errors.email : undefined;
  const passwordError =
    formik.touched.password || formik.submitCount > 0 ? formik.errors.password : undefined;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-medium text-md md:text-sm">
          {UI_TEXT.AUTH.EMAIL}
          <span className="text-red-600">{UI_TEXT.COMMON.REQUIRED_MARKER}</span>
        </label>

        <input
          type="email"
          id="email"
          autoComplete="email"
          placeholder={UI_TEXT.AUTH.ENTER_EMAIL}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'email-error' : undefined}
          {...formik.getFieldProps('email')}
          className={`w-full text-sm md:text-md h-10 px-4 py-2 bg-white rounded-lg border ${emailError ? 'border-red-600' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md`}
        />

        {emailError ? (
          <span id="email-error" role="alert" className="text-sm font-normal text-red-700">
            {emailError}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-medium text-sm">
          {UI_TEXT.AUTH.PASSWORD}
          <span className="text-red-600">{UI_TEXT.COMMON.REQUIRED_MARKER}</span>
        </label>
        <div className="relative rounded-md">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? 'password-error' : undefined}
            {...formik.getFieldProps('password')}
            className={`w-full text-sm md:text-md h-10 px-4 bg-white rounded-lg border ${passwordError ? 'border-red-600' : 'border-gray-300'} py-2 focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md`}
            placeholder={UI_TEXT.AUTH.ENTER_PASSWORD}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? UI_TEXT.COMMON.HIDE_PASSWORD : UI_TEXT.COMMON.SHOW_PASSWORD}
            className="absolute inset-y-0 right-0 px-4 flex items-center text-red-500 hover:text-red-700"
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
        {passwordError ? (
          <span id="password-error" role="alert" className="text-sm font-normal text-red-700">
            {passwordError}
          </span>
        ) : null}
      </div>
      <div className="flex justify-end">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="font-medium text-sm text-red-600 hover:border-b"
        >
          {UI_TEXT.AUTH.FORGOT_PASSWORD_LINK}
        </Link>
      </div>
      <button
        type="submit"
        className={`font-bold text-white bg-linear-to-r from-red-700 to-red-800  p-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md hover:bg-red-700 shadow-rose-400 ${isLoading && 'opacity-50'}`}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Sign In'}
      </button>
    </form>
  );
};

export default BaseLoginForm;
