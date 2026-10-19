import * as Yup from 'yup';
import { APP_CONFIG, VALIDATION_MESSAGES } from '../constants/constants';

export const ChangePasswordValidation = Yup.object().shape({
  otp: Yup.array()
    .of(Yup.string().defined())
    .length(APP_CONFIG.OTP_LENGTH, VALIDATION_MESSAGES.OTP_REQUIRED)
    .test(
      'valid-otp',
      VALIDATION_MESSAGES.OTP_REQUIRED,
      (otp) =>
        Array.isArray(otp) &&
        otp.length === APP_CONFIG.OTP_LENGTH &&
        otp.every((digit) => /^\d$/.test(digit)),
    )
    .required(VALIDATION_MESSAGES.OTP_REQUIRED),
  newPassword: Yup.string()
    .min(APP_CONFIG.PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .required(VALIDATION_MESSAGES.NEW_PASSWORD_REQUIRED),
  confirmNewPassword: Yup.string()
    .min(APP_CONFIG.PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
    .required(VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
    .oneOf([Yup.ref('newPassword')], VALIDATION_MESSAGES.PASSWORDS_MUST_MATCH),
});
