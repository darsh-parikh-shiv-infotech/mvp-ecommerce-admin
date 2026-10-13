import * as Yup from 'yup';
export const ChangePasswordValidation = Yup.object().shape({
  otp: Yup.array()
    .of(Yup.string().defined())
    .length(6, 'Please enter the 6-digit OTP.')
    .test(
      'valid-otp',
      'Please enter the 6-digit OTP.',
      (otp) => Array.isArray(otp) && otp.length === 6 && otp.every((digit) => /^\d$/.test(digit)),
    )
    .required('Please enter the 6-digit OTP.'),
  newPassword: Yup.string()
    .min(7, 'Password must be minimum 7 character long.')
    .required('Please enter new password.'),
  confirmNewPassword: Yup.string()
    .min(7, 'Password must be minimum 7 character long.')
    .required('Please enter new password again.')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});
