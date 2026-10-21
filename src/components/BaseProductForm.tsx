import { useFormik } from 'formik';
import { ProductFormValidationSchema } from '../utils/validations/ProductFormValidation';
import FormField from './common/FormField';
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { initFlowbite } from 'flowbite';
import { useAppDispatch, useAppSelector } from '../utils/hooks/hooks';
import { imageUpload, listAttribute } from '../store/slices/product/productThunk';
import { toast } from 'react-toastify';
import { APP_CONFIG, API_ENDPOINTS, FORM_DEFAULTS, UI_TEXT } from '../utils/constants/constants';
import type { product } from '../store/slices/product/productSlice';

export interface ProductFormValues {
  title: string;
  description: string;
  product_image: string;
  meta_title: string;
  meta_key: string;
  meta_description: string;
  attribute_set_id: number;
}
export type newProductInfoProp = (Partial<product> & { attribute_set_id: number }) | null;

interface BaseProductFormProp {
  btnText: string;
  onSubmit: (values: ProductFormValues) => void;
  isEnabled?: boolean;
  setIsEnabled?: Dispatch<SetStateAction<boolean>>;
  updateFormValues?: newProductInfoProp;
}
const BaseProductForm = ({
  btnText,
  onSubmit,
  isEnabled,
  setIsEnabled,
  updateFormValues,
}: BaseProductFormProp) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(FORM_DEFAULTS.EMPTY_STRING);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { attributeSetData } = useAppSelector((state) => state.product);
  const formik = useFormik<ProductFormValues>({
    initialValues: {
      title: updateFormValues?.title || FORM_DEFAULTS.EMPTY_STRING,
      description: updateFormValues?.description || FORM_DEFAULTS.EMPTY_STRING,
      product_image: updateFormValues?.product_image || FORM_DEFAULTS.EMPTY_STRING,
      meta_title: updateFormValues?.meta_title || FORM_DEFAULTS.EMPTY_STRING,
      meta_key: updateFormValues?.meta_key || FORM_DEFAULTS.EMPTY_STRING,
      meta_description: updateFormValues?.meta_description || FORM_DEFAULTS.EMPTY_STRING,
      attribute_set_id: updateFormValues?.attribute_set_id || APP_CONFIG.DEFAULT_ATTRIBUTE_SET_ID,
    },
    enableReinitialize: true,
    validationSchema: ProductFormValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: ProductFormValues) => {
      onSubmit(values);
    },
  });

  const dispatch = useAppDispatch();
  const fetchAttributes = useCallback(async () => {
    const result = await dispatch(listAttribute());
    if (listAttribute.rejected.match(result)) {
      toast.error(
        result.error?.message || result.payload?.message || UI_TEXT.PRODUCT.FETCH_ATTRIBUTES_FAILED,
      );
    }
  }, [dispatch]);
  useEffect(() => {
    if (attributeSetData.length == 0) fetchAttributes();
  }, [fetchAttributes]);
  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    if (setIsEnabled) setIsEnabled(!formik.dirty);
  }, [formik.dirty, setIsEnabled]);

  const titleError =
    formik.touched.title || formik.submitCount > 0 ? formik.errors.title : undefined;
  const descriptionError =
    formik.touched.description || formik.submitCount > 0 ? formik.errors.description : undefined;
  const productImageError =
    formik.touched.product_image || formik.submitCount > 0
      ? formik.errors.product_image
      : undefined;
  const metaTitleError =
    formik.touched.meta_title || formik.submitCount > 0 ? formik.errors.meta_title : undefined;
  const metaKeyError =
    formik.touched.meta_key || formik.submitCount > 0 ? formik.errors.meta_key : undefined;
  const metaDescriptionError =
    formik.touched.meta_description || formik.submitCount > 0
      ? formik.errors.meta_description
      : undefined;
  const attributeSetError =
    formik.touched.attribute_set_id || formik.submitCount > 0
      ? formik.errors.attribute_set_id
      : undefined;

  return (
    <div>
      {!isEnabled && (
        <div
          className="p-4 mb-4 text-sm text-fg-brand-strong rounded-base bg-brand-softer border"
          role="alert"
        >
          <span className="font-medium">Alert!</span> Please Save Your Updates, Before Moving To
          Next Form
        </div>
      )}
      <form
        method="post"
        encType="multipart/form-data"
        onSubmit={formik.handleSubmit}
        noValidate
        className="flex flex-col gap-4 mx-5"
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            labelText={UI_TEXT.PRODUCT_FORM.TITLE}
            isMadantoryField={true}
            inputFieldId="title"
            inputFieldType="text"
            placeholder={UI_TEXT.PRODUCT_FORM.TITLE_PLACEHOLDER}
            fieldError={titleError}
            fieldProps={formik.getFieldProps('title')}
          />
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="attribute-set-id" className="font-medium text-md md:text-sm">
              {UI_TEXT.PRODUCT.ATTRIBUTE_SET}
              <span className="text-red-600">{UI_TEXT.COMMON.REQUIRED_MARKER}</span>
            </label>

            <select
              id="attribute-set-id"
              aria-invalid={Boolean(attributeSetError)}
              aria-describedby={attributeSetError ? 'attribute-set-id-error' : undefined}
              {...formik.getFieldProps('attribute_set_id')}
              onChange={(event) =>
                formik.setFieldValue('attribute_set_id', Number(event.currentTarget.value))
              }
              className={`text-sm md:text-md px-4 py-2 bg-white rounded-md border ${attributeSetError ? 'border-red-600' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md`}
            >
              {attributeSetData &&
                attributeSetData.map((attribute) => (
                  <option key={attribute.id} value={attribute.id}>
                    {attribute.name}
                  </option>
                ))}
            </select>

            {attributeSetError ? (
              <span
                id="attribute-set-id-error"
                role="alert"
                className="text-sm font-normal text-red-700"
              >
                {attributeSetError}
              </span>
            ) : null}
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormField
            labelText={UI_TEXT.PRODUCT.META_TITLE}
            isMadantoryField={false}
            inputFieldId="meta_title"
            inputFieldType="text"
            placeholder={UI_TEXT.PRODUCT_FORM.META_TITLE_PLACEHOLDER}
            fieldError={metaTitleError}
            fieldProps={formik.getFieldProps('meta_title')}
          />
          <FormField
            labelText={UI_TEXT.PRODUCT.META_KEY}
            isMadantoryField={false}
            inputFieldId="meta_key"
            inputFieldType="text"
            placeholder={UI_TEXT.PRODUCT_FORM.META_KEY_PLACEHOLDER}
            fieldError={metaKeyError}
            fieldProps={formik.getFieldProps('meta_key')}
          />
          <FormField
            labelText={UI_TEXT.PRODUCT.META_DESCRIPTION}
            isMadantoryField={false}
            inputFieldId="meta_description"
            inputFieldType="text"
            placeholder={UI_TEXT.PRODUCT_FORM.META_DESCRIPTION_PLACEHOLDER}
            fieldError={metaDescriptionError}
            fieldProps={formik.getFieldProps('meta_description')}
          />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="description" className="font-medium text-md md:text-sm">
              {UI_TEXT.PRODUCT.DESCRIPTION}
              <span className="text-red-600">{UI_TEXT.COMMON.REQUIRED_MARKER}</span>
            </label>

            <textarea
              id="description"
              placeholder={UI_TEXT.PRODUCT_FORM.DESCRIPTION_PLACEHOLDER}
              aria-invalid={Boolean(descriptionError)}
              aria-describedby={descriptionError ? 'description-error' : undefined}
              {...formik.getFieldProps('description')}
              rows={7}
              className={`text-sm md:text-md px-4 py-2 bg-white rounded-md border ${descriptionError ? 'border-red-600' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md`}
            ></textarea>

            {descriptionError ? (
              <span
                id="description-error"
                role="alert"
                className="text-sm font-normal text-red-700"
              >
                {descriptionError}
              </span>
            ) : null}
          </div>
        </div>
        <div className="w-full my-2">
          <label htmlFor="productImageInput" className="font-medium text-md md:text-sm">
            {UI_TEXT.PRODUCT.UPLOAD_IMAGE}
            <span className="text-red-600">{UI_TEXT.COMMON.REQUIRED_MARKER}</span>
          </label>
          <div className="w-full grid grid-cols-2">
            <div className="flex items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
              >
                <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">{UI_TEXT.PRODUCT.CLICK_TO_UPLOAD}</span>
                  </p>
                  <p className="text-xs">{UI_TEXT.PRODUCT.ALLOWED_IMAGE_TYPES}</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploadingImage}
                  onChange={async (e) => {
                    const file = e.currentTarget.files?.[0];
                    e.currentTarget.value = '';
                    if (!file) return;

                    setIsUploadingImage(true);
                    try {
                      const result = await dispatch(imageUpload(file));
                      if (imageUpload.rejected.match(result)) {
                        toast.error(result.payload?.message || UI_TEXT.PRODUCT.UPLOAD_FAILED);
                        return;
                      }

                      const uploadedImage = result.payload.data.image[0];
                      if (!uploadedImage?.fileName || !uploadedImage.url) {
                        toast.error(UI_TEXT.PRODUCT.UPLOAD_SUCCEEDED_NO_IMAGE);
                        return;
                      }

                      await formik.setFieldValue('product_image', uploadedImage.fileName);
                      setUploadedImageUrl(uploadedImage.url);
                      toast.success(result.payload.message || UI_TEXT.PRODUCT.UPLOAD_SUCCESS);
                    } finally {
                      setIsUploadingImage(false);
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex min-h-64 items-center justify-center rounded-base border border-default p-4">
              {uploadedImageUrl || updateFormValues?.product_image ? (
                <img
                  src={
                    uploadedImageUrl ||
                    import.meta.env.VITE_API_SERVER_BASE_URL +
                      API_ENDPOINTS.UPLOADED_FILE_BASE_PATH +
                      updateFormValues?.product_image
                  }
                  alt={UI_TEXT.COMMON.UPLOADED_PRODUCT_PREVIEW_ALT}
                  className="max-h-60 max-w-full object-contain"
                />
              ) : (
                <p className="text-sm text-body">
                  {isUploadingImage
                    ? UI_TEXT.PRODUCT.UPLOADING_IMAGE
                    : UI_TEXT.PRODUCT.IMAGE_PREVIEW}
                </p>
              )}
            </div>
          </div>
          {productImageError ? (
            <span role="alert" className="mt-2 block text-sm font-normal text-red-700">
              {productImageError}
            </span>
          ) : null}
        </div>
        <div className="w-full my-2">
          <button
            type="submit"
            className="w-full p-4 bg-red-200 hover:bg-red-100 hover:cursor-pointer"
          >
            {btnText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BaseProductForm;
