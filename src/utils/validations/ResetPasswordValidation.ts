import * as Yup from 'yup';
export const ResetPasswordValidation = Yup.object().shape({
  email: Yup.string().email('Please enter correct email.').required('Please enter your email.'),
});
