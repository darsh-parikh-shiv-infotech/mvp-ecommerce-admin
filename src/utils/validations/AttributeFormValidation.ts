import * as Yup from 'yup';

export const AttributeFormSchema = Yup.object().shape({
    id:Yup.string().optional(),
    title:Yup.string().required('Please enter title'),
    available_quantity:Yup.number().required('Please enter available quantity'),
    on_hand_quantity:Yup.number().required("Please enter on hand quantity"),
    code:Yup.string().required("Please enter code"),
    fake_price:Yup.number().required("Please enter fake price"),
    price:Yup.number().required("Please enter price"),
    isEditing:Yup.bool().required(),
});