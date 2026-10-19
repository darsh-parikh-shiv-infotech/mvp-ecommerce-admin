import { useFormik } from 'formik';
import { ResetPasswordValidation } from '../utils/validations/ResetPasswordValidation';
import { Link } from 'react-router-dom';
import { MdOutlineEmail } from 'react-icons/md';
import { FORM_DEFAULTS, ROUTES, UI_TEXT } from '../utils/constants/constants';

interface BaseForgotPasswordFormProp {
  loading: boolean;
  submitHandler: (email: string) => void;
}

interface ResetPasswordFormValues {
  email: string;
}

const BaseForgotPasswordForm = ({ loading, submitHandler }: BaseForgotPasswordFormProp) => {
  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      email: FORM_DEFAULTS.EMPTY_STRING,
    },
    validationSchema: ResetPasswordValidation,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      submitHandler(values.email);
    },
  });
  const emailError =
    formik.touched.email || formik.submitCount > 0 ? formik.errors.email : undefined;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="shrink-0 bg-gray-200 p-2 rounded-full">
          <MdOutlineEmail color="red" size={15} />
        </div>
        <span className="uppercase font-semibold text-xs leading-0 text-gray-400">
          {UI_TEXT.AUTH.EMAIL_STEP}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-md md:text-2xl font-bold">{UI_TEXT.AUTH.FORGOT_PASSWORD}</span>
        <span className="text-[12px] md:text-sm font-body">
          {UI_TEXT.AUTH.RESET_PASSWORD_DESCRIPTION}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-medium text-sm md:text-md md:text-sm">
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
      <button
        type="submit"
        className={`font-bold text-white bg-linear-to-r from-red-700 to-red-800  p-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md hover:bg-red-700 shadow-rose-400 ${loading && 'opacity-50'}`}
        disabled={loading}
      >
        {loading ? UI_TEXT.COMMON.LOADING : UI_TEXT.AUTH.SEND_OTP}
      </button>
      <div className="flex justify-center">
        <Link to={ROUTES.LOGIN} className="font-medium text-sm text-red-600 hover:border-b">
          {UI_TEXT.COMMON.BACK_TO_SIGN_IN}
        </Link>
      </div>
    </form>
  );
};

export default BaseForgotPasswordForm;
