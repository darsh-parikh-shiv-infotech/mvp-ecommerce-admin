import * as Yup from 'yup';
import { ATTRIBUTE_VALIDATION_MESSAGES } from '../constants/constants';
export const AttributeFormSchema = Yup.object().shape({
  id: Yup.string().optional(),
  title: Yup.string().required(ATTRIBUTE_VALIDATION_MESSAGES.TITLE_REQUIRED),
  available_quantity: Yup.number().required(
    ATTRIBUTE_VALIDATION_MESSAGES.AVAILABLE_QUANTITY_REQUIRED,
  ),
  on_hand_quantity: Yup.number().required(ATTRIBUTE_VALIDATION_MESSAGES.ON_HAND_QUANTITY_REQUIRED),
  code: Yup.string().required(ATTRIBUTE_VALIDATION_MESSAGES.CODE_REQUIRED),
  fake_price: Yup.number().required(ATTRIBUTE_VALIDATION_MESSAGES.FAKE_PRICE_REQUIRED),
  price: Yup.number().required(ATTRIBUTE_VALIDATION_MESSAGES.PRICE_REQUIRED),
  isEditing: Yup.bool().required(),
});
