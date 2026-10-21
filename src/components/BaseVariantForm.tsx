import { useFormik } from 'formik';
import FormField from './common/FormField';
import { API_ENDPOINTS, FORM_DEFAULTS, UI_TEXT } from '../utils/constants/constants';
import type { EditableVariant } from '../store/slices/product/productSlice';
import { VariantFormSchama } from '../utils/validations/VariantFormValidation';
import { useState } from 'react';
import { useAppDispatch } from '../utils/hooks/hooks';
import { imageUpload } from '../store/slices/product/productThunk';
import { toast } from 'react-toastify';

export interface VariantFormValues {
  id: number | undefined;
  clientId?: string;
  title: string;
  code: string;
  fake_price: number;
  price: number;
  available_quantity: number;
  on_hand_quantity: number;
  product_variant_image: string[];
}
type updateFormValuesProp = EditableVariant | null;
interface BaseAttributeFormProp {
  onSubmit: (values: VariantFormValues) => void;
  updateFormValues?: updateFormValuesProp;
}

const BaseVariantForm = ({ onSubmit, updateFormValues }: BaseAttributeFormProp) => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const dispatch = useAppDispatch();

  const formik = useFormik<VariantFormValues>({
    initialValues: {
      id: updateFormValues?.id ?? undefined,
      clientId: updateFormValues?.clientId,
      title: updateFormValues?.title ?? FORM_DEFAULTS.EMPTY_STRING,
      available_quantity: updateFormValues?.available_quantity ?? FORM_DEFAULTS.ZERO,
      on_hand_quantity: updateFormValues?.on_hand_quantity ?? FORM_DEFAULTS.ZERO,
      code: updateFormValues?.code ?? FORM_DEFAULTS.EMPTY_STRING,
      fake_price: updateFormValues?.fake_price ?? FORM_DEFAULTS.ZERO,
      price: updateFormValues?.price ?? FORM_DEFAULTS.ZERO,
      product_variant_image: updateFormValues?.product_variant_image ?? [],
    },
    enableReinitialize: true,
    validationSchema: VariantFormSchama,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: VariantFormValues) => {
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
  const productImagesError =
    formik.touched.product_variant_image || formik.submitCount > 0
      ? formik.errors.product_variant_image
      : undefined;

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
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="image-file" className="font-medium text-md md:text-sm">
            {UI_TEXT.VARIANT.IMAGE_PLACEHOLDER}
          </label>
          <input
            id="image-file"
            type="file"
            multiple
            accept="image/*"
            className={`w-full text-sm md:text-md h-10 px-4 py-2 bg-white rounded-md border ${productImagesError ? 'border-red-600' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md hover:cursor-pointer`}
            disabled={isUploadingImage}
            onChange={async (e) => {
              const files = Array.from(e.currentTarget.files ?? []);
              e.currentTarget.value = '';
              if (files.length === 0) return;

              setIsUploadingImage(true);
              try {
                const imageUrls = [...formik.values.product_variant_image];
                let uploadedCount = 0;

                for (const file of files) {
                  const result = await dispatch(imageUpload(file));
                  if (imageUpload.rejected.match(result)) {
                    toast.error(result.payload?.message || UI_TEXT.PRODUCT.UPLOAD_FAILED);
                    continue;
                  }

                  const uploadedImages = result.payload.data.image;
                  const uploadedUrls = uploadedImages
                    .map((image) => image?.url)
                    .filter((url): url is string => Boolean(url));
                  if (uploadedUrls.length === 0) {
                    toast.error(UI_TEXT.PRODUCT.UPLOAD_SUCCEEDED_NO_IMAGE);
                    continue;
                  }

                  imageUrls.push(...uploadedUrls);
                  uploadedCount += uploadedUrls.length;
                }

                if (uploadedCount > 0) {
                  await formik.setFieldValue('product_variant_image', imageUrls);
                  toast.success(UI_TEXT.PRODUCT.UPLOAD_SUCCESS);
                }
              } finally {
                setIsUploadingImage(false);
              }
            }}
          />
          {productImagesError && (
            <span role="alert" className="text-sm font-normal text-red-700">
              {productImagesError}
            </span>
          )}
        </div>
        <div className="flex min-h-25 items-center justify-center rounded-base border border-default p-4">
          {formik.values.product_variant_image.length > 0 ? (
            <div className="w-full flex gap-2 overflow-x-scroll scrollbar-none">
              {formik.values.product_variant_image.map((imageUrl, index) => (
                <div key={`${imageUrl}-${index}`} className="relative shrink-0">
                  <img
                    src={
                      imageUrl.startsWith('http')
                        ? imageUrl
                        : import.meta.env.VITE_API_SERVER_BASE_URL +
                          API_ENDPOINTS.UPLOADED_FILE_BASE_PATH +
                          imageUrl
                    }
                    alt={UI_TEXT.COMMON.UPLOADED_PRODUCT_PREVIEW_ALT}
                    className="h-25 w-30"
                  />
                  <button
                    type="button"
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute right-1 top-1 rounded bg-white px-1 text-red-600"
                    onClick={() =>
                      formik.setFieldValue(
                        'product_variant_image',
                        formik.values.product_variant_image.filter(
                          (_, imageIndex) => imageIndex !== index,
                        ),
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-body">
              {isUploadingImage ? UI_TEXT.PRODUCT.UPLOADING_IMAGE : UI_TEXT.PRODUCT.IMAGE_PREVIEW}
            </p>
          )}
        </div>
      </div>
      <div className="w-full my-2">
        <button className="w-full p-4 bg-red-200 hover:bg-red-100 hover:cursor-pointer">
          {updateFormValues ? UI_TEXT.VARIANT.EDIT : UI_TEXT.VARIANT.ADD}
        </button>
      </div>
    </form>
  );
};

export default BaseVariantForm;
