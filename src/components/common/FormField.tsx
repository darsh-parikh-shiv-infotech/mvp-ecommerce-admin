import type { FieldInputProps } from "formik"
import { FORM_DEFAULTS, UI_TEXT } from "../../utils/constants/constants";

interface FormFieldProp {
    labelText: string,
    isMadantoryField:boolean,
    inputFieldType: string,
    inputFieldId: string,
    placeholder?: string,
    fieldError: string|undefined,
    fieldProps: FieldInputProps<string>;
}
const FormField = ({
    labelText,
    isMadantoryField,
    inputFieldType,
    inputFieldId,
    placeholder = FORM_DEFAULTS.EMPTY_STRING,
    fieldError,
    fieldProps
}: FormFieldProp
) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={inputFieldId} className="font-medium text-md md:text-sm">
                {labelText}
                <span className="text-red-600">{isMadantoryField && UI_TEXT.COMMON.REQUIRED_MARKER}</span>
            </label>

            <input
                type={inputFieldType}
                id={inputFieldId}
                placeholder={placeholder}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? `${inputFieldId}-error` : undefined}
                {...fieldProps}
                className={`w-full text-sm md:text-md h-10 px-4 py-2 bg-white rounded-md border ${fieldError ? 'border-red-600' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md`}
            />

            {fieldError && (
                <span id={`${inputFieldId}-error`} role="alert" className="text-sm font-normal text-red-700">
                    {fieldError}
                </span>
            )}
        </div>
    )
}

export default FormField
