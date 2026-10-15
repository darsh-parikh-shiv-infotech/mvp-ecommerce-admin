import { useState } from "react"
import { Link } from "react-router-dom"
import BaseProductForm, { type ProductFormValues } from "../../components/BaseProductForm"
import BaseVariantForm from "../../components/BaseVariantForm"
import type { variant } from "../../store/slices/product/productSlice"
import BaseVariantTable from "../../components/BaseVariantTable"

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
                <span className="text-3xl font-bold">Add Product</span>
                <Link to={"/product"} className="p-2 rounded-md font-semibold hover:underline text-sm">
                    <span className="text-lg">&larr; {" "}</span> Back To Listing
                </Link>
            </div>
            <div className="w-full flex flex-row gap-2 border-b border-red-300 ">
                <button type="button" onClick={() => setStep(1)} className={`p-4 hover:cursor-pointer ${step == 1 && 'bg-red-100'}`}>Base Product Info</button>
                <button type="button" onClick={() => setStep(2)} className={`p-4 hover:cursor-pointer ${step == 2 && 'bg-red-100'} disabled:opacity-20 disabled:bg-none`} disabled={!secondStepEnable}>Variant Info</button>
            </div>
            {
                step === 1 && <BaseProductForm btnText="Check And Next" onSubmit={handleProductBtn} updateFormValues={newProductInfo} />
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
