import { useFormik } from "formik";
import { AttributeFormSchema } from "../utils/validations/AttributeFormValidation";
import FormField from "./common/FormField";

export interface AttributeFormValues {
    id:number|undefined,
    title: string,
    code: string,
    fake_price: number,
    price: number,
    available_quantity: number,
    on_hand_quantity: number,
    isEditing:boolean
}
type updateFormValuesProp = AttributeFormValues & {id:number}
interface BaseAttributeFormProp {
    onSubmit: (values: AttributeFormValues) => void;
    updateFormValues?: updateFormValuesProp | null
}

const BaseVariantForm = ({  onSubmit, updateFormValues }: BaseAttributeFormProp) => {
    const formik = useFormik<AttributeFormValues>({
        initialValues: {
            id:updateFormValues?.id || undefined,
            title: updateFormValues?.title || '',
            available_quantity: updateFormValues?.available_quantity || 0,
            on_hand_quantity: updateFormValues?.on_hand_quantity || 0,
            code: updateFormValues?.code || '',
            fake_price: updateFormValues?.fake_price || 0,
            price: updateFormValues?.price || 0,
            isEditing:updateFormValues?.isEditing || false
        },
        validationSchema: AttributeFormSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values: AttributeFormValues) => {
            onSubmit(values);
        },
    });
    const titleError =
        formik.touched.title || formik.submitCount > 0 ? formik.errors.title : undefined;
    const availableQuantityError =
        formik.touched.available_quantity || formik.submitCount > 0 ? formik.errors.available_quantity : undefined;
    const onHandQuantityError =
        formik.touched.on_hand_quantity || formik.submitCount > 0 ? formik.errors.on_hand_quantity : undefined;
    const codeError =
        formik.touched.code || formik.submitCount > 0 ? formik.errors.code : undefined;
    const fakePriceError =
        formik.touched.fake_price || formik.submitCount > 0 ? formik.errors.fake_price : undefined;
    const priceError =
        formik.touched.price || formik.submitCount > 0 ? formik.errors.price : undefined;

    return (
        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4 mx-5">
            <input type="hidden" id="id" {...formik.getFieldProps("id")} />
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                    labelText="Title"
                    isMadantoryField={true}
                    inputFieldId="title"
                    inputFieldType="text"
                    placeholder="Enter Variant Title"
                    fieldError={titleError}
                    fieldProps={formik.getFieldProps("title")}
                />
                <FormField
                    labelText="Code/SKU"
                    isMadantoryField={true}
                    inputFieldId="code"
                    inputFieldType="text"
                    placeholder="Enter Code"
                    fieldError={codeError}
                    fieldProps={formik.getFieldProps("code")}
                />
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                    labelText="Available Quantity"
                    isMadantoryField={true}
                    inputFieldId="available_quantity"
                    inputFieldType="number"
                    placeholder="Enter Available Quantity"
                    fieldError={availableQuantityError}
                    fieldProps={formik.getFieldProps("available_quantity")}
                />
                <FormField
                    labelText="On Hand Quantity"
                    isMadantoryField={true}
                    inputFieldId="on_hand_quantity"
                    inputFieldType="number"
                    placeholder="Enter On Hand Quantity"
                    fieldError={onHandQuantityError}
                    fieldProps={formik.getFieldProps("on_hand_quantity")}
                />
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                    labelText="Fake Price"
                    isMadantoryField={true}
                    inputFieldId="fake_price"
                    inputFieldType="number"
                    placeholder="Enter Fake Price"
                    fieldError={fakePriceError}
                    fieldProps={formik.getFieldProps("fake_price")}
                />
                <FormField
                    labelText="Price"
                    isMadantoryField={true}
                    inputFieldId="price"
                    inputFieldType="number"
                    placeholder="Enter Price"
                    fieldError={priceError}
                    fieldProps={formik.getFieldProps("price")}
                />
            </div>
            <div className="w-full my-2">
                <button className="w-full p-4 bg-red-200 hover:bg-red-100">{updateFormValues?.isEditing ? "Edit Variant" : "Add Variant"}</button>
            </div>
        </form>
    )
}

export default BaseVariantForm