import * as Yup from 'yup';
import { ATTRIBUTE_VALIDATION_MESSAGES } from '../constants/constants';
export const VariantFormSchama = Yup.object().shape({
  id: Yup.string().optional(),
  clientId: Yup.string().optional(),
  title: Yup.string().required(ATTRIBUTE_VALIDATION_MESSAGES.TITLE_REQUIRED),
  available_quantity: Yup.number().required(
    ATTRIBUTE_VALIDATION_MESSAGES.AVAILABLE_QUANTITY_REQUIRED,
  ),
  product_variant_image: Yup.array()
    .of(Yup.string().required(ATTRIBUTE_VALIDATION_MESSAGES.IMAGE_STRING_REQUIRED))
    .optional(),
  on_hand_quantity: Yup.number().required(ATTRIBUTE_VALIDATION_MESSAGES.ON_HAND_QUANTITY_REQUIRED),
  code: Yup.string().required(ATTRIBUTE_VALIDATION_MESSAGES.CODE_REQUIRED),
  fake_price: Yup.number().required(ATTRIBUTE_VALIDATION_MESSAGES.FAKE_PRICE_REQUIRED),
  price: Yup.number().required(ATTRIBUTE_VALIDATION_MESSAGES.PRICE_REQUIRED),
});
