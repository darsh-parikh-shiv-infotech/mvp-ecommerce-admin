import { useFormik } from 'formik';
import { CategoryValidationSchema } from '../utils/validations/CategoryFormValidation';
import { FORM_DEFAULTS, UI_TEXT } from '../utils/constants/constants';

export interface updateCategoryFormValues {
  name: string;
}
export interface CategoryFormValues {
  name: string;
}
interface BaseCategoryFormProp {
  updateValue?: updateCategoryFormValues;
  loading: boolean;
  submitBtnText: string;
  onSubmit: (name: string) => void;
}

const BaseCategoryForm = ({
  loading: isLoading,
  submitBtnText,
  onSubmit,
  updateValue,
}: BaseCategoryFormProp) => {
  const formik = useFormik<CategoryFormValues>({
    initialValues: {
      name: updateValue?.name || FORM_DEFAULTS.EMPTY_STRING,
    },
    validationSchema: CategoryValidationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: CategoryFormValues) => {
      onSubmit(values.name);
    },
  });

  const nameError = formik.touched.name || formik.submitCount > 0 ? formik.errors.name : undefined;
  return (
    <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="font-medium text-md md:text-sm">
          {UI_TEXT.CATEGORY.NAME}
          <span className="text-red-600">{UI_TEXT.COMMON.REQUIRED_MARKER}</span>
        </label>
        <input
          type="text"
          id="name"
          autoComplete="name"
          placeholder={UI_TEXT.CATEGORY.NAME_PLACEHOLDER}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? 'name-error' : undefined}
          {...formik.getFieldProps('name')}
          className={`w-full text-sm md:text-md h-10 px-4 py-2 bg-white rounded-lg border ${nameError ? 'border-red-600' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md`}
        />

        {nameError ? (
          <span id="nameError-error" role="alert" className="text-sm font-normal text-red-700">
            {nameError}
          </span>
        ) : null}
      </div>
      <button
        type="submit"
        className={`font-bold text-white bg-linear-to-r from-red-700 to-red-800  p-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md hover:bg-red-700 shadow-rose-400 ${isLoading && 'opacity-50'}`}
        disabled={isLoading}
      >
        {isLoading ? UI_TEXT.COMMON.LOADING : submitBtnText}
      </button>
    </form>
  );
};

export default BaseCategoryForm;
