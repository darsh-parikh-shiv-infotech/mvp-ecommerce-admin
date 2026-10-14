import * as Yup from 'yup';

export const CategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter category name'),
});
