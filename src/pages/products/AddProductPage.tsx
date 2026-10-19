import { useState } from "react"
import { Link } from "react-router-dom"
import BaseProductForm, { type ProductFormValues } from "../../components/BaseProductForm"
import BaseVariantForm from "../../components/BaseVariantForm"
import type { variant } from "../../store/slices/product/productSlice"
import BaseVariantTable from "../../components/BaseVariantTable"
import { ROUTES, UI_TEXT } from "../../utils/constants/constants";

const AddProductPage = () => {

    const [step, setStep] = useState<1 | 2>(1)
    const [secondStepEnable, setSecondStepEnable] = useState(true)
    const [newProductInfo, setNewProductInfo] = useState<ProductFormValues | null>(null)
    const handleProductBtn = (formValues: ProductFormValues) => {
        setNewProductInfo({ ...formValues })
        setSecondStepEnable(true)
        setStep(2)
    }
    interface ISelectedVariant extends variant {
        isEditing: boolean;
    }
    const selectedVariant: ISelectedVariant | null = null

    const [variantList, setVariantList] = useState<Partial<variant>[]>([])
    const handleVariantBtn = (formValues: Partial<ISelectedVariant> | null) => {
        if (formValues && formValues.isEditing) {
            const newVariant: Partial<variant> = {
                title: formValues.title,
                fake_price: formValues.fake_price,
                price: formValues.price,
                on_hand_quantity: formValues.on_hand_quantity,
                available_quantity: formValues.available_quantity,
                code: formValues.code
            }
            setVariantList([...variantList, newVariant])
        }
    }

    return (
        <div className="w-full flex flex-col gap-4 my-4">
            <div className="flex gap-2 justify-between">
                <span className="text-3xl font-bold">{UI_TEXT.PRODUCT.ADD_TITLE}</span>
                <Link to={ROUTES.PRODUCT} className="p-2 rounded-md font-semibold hover:underline text-sm">
                    <span className="text-lg">{UI_TEXT.COMMON.BACK_ARROW}{" "}</span> {UI_TEXT.PRODUCT.BACK_TO_LISTING}
                </Link>
            </div>
            <div className="w-full flex flex-row gap-2 border-b border-red-300 ">
                <button type="button" onClick={() => setStep(1)} className={`p-4 hover:cursor-pointer ${step == 1 && 'bg-red-100'}`}>{UI_TEXT.PRODUCT_FORM.BASE_INFO}</button>
                <button type="button" onClick={() => setStep(2)} className={`p-4 hover:cursor-pointer ${step == 2 && 'bg-red-100'} disabled:opacity-20 disabled:bg-none`} disabled={!secondStepEnable}>{UI_TEXT.PRODUCT_FORM.VARIANT_INFO}</button>
            </div>
            {
                step === 1 && <BaseProductForm btnText={UI_TEXT.PRODUCT_FORM.NEXT} onSubmit={handleProductBtn} updateFormValues={newProductInfo} />
            }
            {
                step === 2 && 
                <>
                    <BaseVariantForm onSubmit={handleVariantBtn} updateFormValues={selectedVariant} />
                    <BaseVariantTable/>
                </>
            }
        </div>
    )
}

export default AddProductPage
