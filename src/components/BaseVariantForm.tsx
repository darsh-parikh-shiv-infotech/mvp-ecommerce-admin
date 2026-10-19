import { useFormik } from 'formik';
import { AttributeFormSchema } from '../utils/validations/AttributeFormValidation';
import FormField from './common/FormField';
import { FORM_DEFAULTS, UI_TEXT } from '../utils/constants/constants';
import type { ISelectedVariant } from '../pages/products/AddProductPage';

export interface AttributeFormValues {
  id: number | undefined;
  title: string;
  code: string;
  fake_price: number;
  price: number;
  available_quantity: number;
  on_hand_quantity: number;
  isEditing: boolean;
}
type updateFormValuesProp = Partial<ISelectedVariant> | null;
interface BaseAttributeFormProp {
  onSubmit: (values: AttributeFormValues) => void;
  updateFormValues?: updateFormValuesProp;
}

const BaseVariantForm = ({ onSubmit, updateFormValues }: BaseAttributeFormProp) => {
  const formik = useFormik<AttributeFormValues>({
    initialValues: {
      id: updateFormValues?.id ?? undefined,
      title: updateFormValues?.title ?? FORM_DEFAULTS.EMPTY_STRING,
      available_quantity: updateFormValues?.available_quantity ?? FORM_DEFAULTS.ZERO,
      on_hand_quantity: updateFormValues?.on_hand_quantity ?? FORM_DEFAULTS.ZERO,
      code: updateFormValues?.code ?? FORM_DEFAULTS.EMPTY_STRING,
      fake_price: updateFormValues?.fake_price ?? FORM_DEFAULTS.ZERO,
      price: updateFormValues?.price ?? FORM_DEFAULTS.ZERO,
      isEditing: updateFormValues?.isEditing ?? false,
    },
    enableReinitialize: true,
    validationSchema: AttributeFormSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: AttributeFormValues) => {
      onSubmit({
        ...values,
        fake_price: Number(values.fake_price),
        price: Number(values.price),
        available_quantity: Number(values.available_quantity),
        on_hand_quantity: Number(values.on_hand_quantity),
      });
      formik.resetForm();
    },
  });
  const titleError =
    formik.touched.title || formik.submitCount > 0 ? formik.errors.title : undefined;
  const availableQuantityError =
    formik.touched.available_quantity || formik.submitCount > 0
      ? formik.errors.available_quantity
      : undefined;
  const onHandQuantityError =
    formik.touched.on_hand_quantity || formik.submitCount > 0
      ? formik.errors.on_hand_quantity
      : undefined;
  const codeError = formik.touched.code || formik.submitCount > 0 ? formik.errors.code : undefined;
  const fakePriceError =
    formik.touched.fake_price || formik.submitCount > 0 ? formik.errors.fake_price : undefined;
  const priceError =
    formik.touched.price || formik.submitCount > 0 ? formik.errors.price : undefined;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4 mx-5">
      <input type="hidden" id="id" {...formik.getFieldProps('id')} />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
        <FormField
          labelText={UI_TEXT.VARIANT.TITLE}
          isMadantoryField={true}
          inputFieldId="title"
          inputFieldType="text"
          placeholder={UI_TEXT.VARIANT.TITLE_PLACEHOLDER}
          fieldError={titleError}
          fieldProps={formik.getFieldProps('title')}
        />
        <FormField
          labelText={UI_TEXT.VARIANT.CODE_SKU}
          isMadantoryField={true}
          inputFieldId="code"
          inputFieldType="text"
          placeholder={UI_TEXT.VARIANT.CODE_PLACEHOLDER}
          fieldError={codeError}
          fieldProps={formik.getFieldProps('code')}
        />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
        <FormField
          labelText={UI_TEXT.VARIANT.AVAILABLE_QUANTITY}
          isMadantoryField={true}
          inputFieldId="available_quantity"
          inputFieldType="number"
          placeholder={UI_TEXT.VARIANT.AVAILABLE_QUANTITY_PLACEHOLDER}
          fieldError={availableQuantityError}
          fieldProps={formik.getFieldProps('available_quantity')}
        />
        <FormField
          labelText={UI_TEXT.VARIANT.ON_HAND_QUANTITY}
          isMadantoryField={true}
          inputFieldId="on_hand_quantity"
          inputFieldType="number"
          placeholder={UI_TEXT.VARIANT.ON_HAND_QUANTITY_PLACEHOLDER}
          fieldError={onHandQuantityError}
          fieldProps={formik.getFieldProps('on_hand_quantity')}
        />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
        <FormField
          labelText={UI_TEXT.VARIANT.FAKE_PRICE}
          isMadantoryField={true}
          inputFieldId="fake_price"
          inputFieldType="number"
          placeholder={UI_TEXT.VARIANT.FAKE_PRICE_PLACEHOLDER}
          fieldError={fakePriceError}
          fieldProps={formik.getFieldProps('fake_price')}
        />
        <FormField
          labelText={UI_TEXT.VARIANT.PRICE}
          isMadantoryField={true}
          inputFieldId="price"
          inputFieldType="number"
          placeholder={UI_TEXT.VARIANT.PRICE_PLACEHOLDER}
          fieldError={priceError}
          fieldProps={formik.getFieldProps('price')}
        />
      </div>
      <div className="w-full my-2">
        <button className="w-full p-4 bg-red-200 hover:bg-red-100">
          {updateFormValues?.isEditing ? UI_TEXT.VARIANT.EDIT : UI_TEXT.VARIANT.ADD}
        </button>
      </div>
    </form>
  );
};

export default BaseVariantForm;
