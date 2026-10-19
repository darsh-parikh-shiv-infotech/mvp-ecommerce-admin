import * as Yup from 'yup';
import { VALIDATION_MESSAGES } from '../constants/constants';

export const CategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required(VALIDATION_MESSAGES.CATEGORY_NAME_REQUIRED),
});
