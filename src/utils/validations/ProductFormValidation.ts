import * as Yup from 'yup';

export const ProductFormValidationSchema = Yup.object().shape({
    title:Yup.string().required('Please enter title'),
    description:Yup.string().required('Please enter description'),
    product_image:Yup.string().required('Please upload image'),
    attribute_set:Yup.number().required("Please Select Attribute"),
    meta_title:Yup.string().optional(),
    meta_key:Yup.string().optional(),
    meta_description:Yup.string().optional()
});