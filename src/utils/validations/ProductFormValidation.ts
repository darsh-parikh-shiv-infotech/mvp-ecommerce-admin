import * as Yup from 'yup';
import { VALIDATION_MESSAGES } from '../constants/constants';

export const ProductFormValidationSchema = Yup.object().shape({
  title: Yup.string().required(VALIDATION_MESSAGES.PRODUCT_TITLE_REQUIRED),
  description: Yup.string().required(VALIDATION_MESSAGES.PRODUCT_DESCRIPTION_REQUIRED),
  product_image: Yup.string().required(VALIDATION_MESSAGES.PRODUCT_IMAGE_REQUIRED),
  attribute_set_id: Yup.number().required(VALIDATION_MESSAGES.ATTRIBUTE_REQUIRED),
  meta_title: Yup.string().optional(),
  meta_key: Yup.string().optional(),
  meta_description: Yup.string().optional(),
});
