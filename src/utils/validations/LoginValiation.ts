import * as Yup from 'yup';
import { APP_CONFIG, VALIDATION_MESSAGES } from '../constants/constants';

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .required(VALIDATION_MESSAGES.EMAIL_REQUIRED),
  password: Yup.string()
    .min(APP_CONFIG.PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .required(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
});
