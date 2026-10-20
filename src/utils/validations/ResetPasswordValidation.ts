import * as Yup from 'yup';
import { VALIDATION_MESSAGES } from '../constants/constants';

export const ResetPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .required(VALIDATION_MESSAGES.EMAIL_REQUIRED),
});
