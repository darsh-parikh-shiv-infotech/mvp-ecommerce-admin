import * as Yup from 'yup';

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Please enter correct email.').required('Please enter your email.'),
  password: Yup.string()
    .min(7, 'Password must be minimum 7 character long.')
    .required('Please enter your password.'),
});
