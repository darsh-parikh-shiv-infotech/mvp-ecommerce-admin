import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../utils/hooks/hooks";
import { deleteVariant, updateProduct, viewProduct, type updateProductFormRequest } from "../../store/slices/product/productThunk";
import { toast } from "react-toastify";
import { ROUTES, UI_TEXT, APP_CONFIG, PRODUCT_STATUSES } from "../../utils/constants/constants";
import { useEffect, useState } from "react";
import FullLoader from "../../components/common/FullLoader";
import BaseProductForm, { type newProductInfoProp, type ProductFormValues } from "../../components/BaseProductForm";
import BaseVariantForm from "../../components/BaseVariantForm";
import BaseVariantTable from "../../components/BaseVariantTable";
import type { variant } from "../../store/slices/product/productSlice";
import type { ISelectedVariant } from "./AddProductPage";

function ProductEditPage() {
    const { id } = useParams();
    const [step, setStep] = useState<1 | 2>(1)
    const navigate=useNavigate();
    const [newUpdatedProductInfo, setNewUpdatedProductInfo] = useState<newProductInfoProp>(null);
    const { selectedProduct, isLoading } = useAppSelector((state) => state.product);
    const [variantList, setVariantList] = useState<Partial<variant>[]>(selectedProduct?.variants || []);
    const [selectedVariant, setSelectedVariant] = useState<Partial<ISelectedVariant> | null>(null);
    const { user } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    async function fetchData(id: number) {
        if (id) {
            const result = await dispatch(viewProduct({ id }));
            if (viewProduct.rejected.match(result)) {
                toast.error(result.payload?.message || UI_TEXT.PRODUCT.FETCH_SINGLE_FAILED);
            }
        }
        return;
    }
    const handleProductBtn = (formValues: ProductFormValues) => {
        setNewUpdatedProductInfo({ ...formValues });
        setStep(2);
    };
    const handleEditVariant = (id: number | undefined) => {
        if (id) {
            const findVariant: Partial<ISelectedVariant> | null =
                variantList.find((variant) => variant.id == id) || null;
            if (findVariant) {
                setSelectedVariant({ ...findVariant, isEditing: true });
                return;
            }
        }

        toast.error(UI_TEXT.VARIANT.FALLBACK_EDIT_ERROR);
        return;
    };
    const handleVariantFormBtn = (formValues: Partial<ISelectedVariant | null>) => {
        if (formValues && formValues.isEditing == false) {
            const newVariant: Partial<variant> = {
                id: new Date().getTime(),
                title: formValues.title,
                fake_price: formValues.fake_price,
                price: formValues.price,
                on_hand_quantity: formValues.on_hand_quantity,
                available_quantity: formValues.available_quantity,
                code: formValues.code,
                status: PRODUCT_STATUSES.ACTIVE,
            };
            setVariantList([...variantList, newVariant]);
            setSelectedVariant(null);
        }
        if (formValues && formValues.isEditing == true) {
            if (variantList.find((variant) => variant.id == formValues.id)) {
                setVariantList([
                    ...variantList.map((variant) => {
                        if (variant.id == formValues.id) {
                            return { ...variant, ...formValues };
                        }
                        return variant;
                    }),
                ]);
                setSelectedVariant(null);
            }
        }
        return;
    };
    const handleDeleteVariant = (id: number | undefined) => {

        if (id) {
            const result = dispatch(deleteVariant({ id }))
            if (deleteVariant.rejected.match(result)) {
                toast.error(result.payload?.message || "Failed")
                return
            }

            const findVariant: Partial<ISelectedVariant> | null =
                variantList.find((variant) => variant.id == id) || null;
            if (findVariant) {
                setVariantList([...variantList.filter((variant) => variant.id != id)]);
                if (selectedVariant?.id == id) setSelectedVariant(null);

                return;
            }
        }

        toast.error(UI_TEXT.VARIANT.FALLBACK_EDIT_ERROR);
        return;
    };
    const handleEditingProduct = async () => {
        if (!Number(user?.id)) {
            toast.error('Unable to identify the current user.');
            return;
        }

        if (!newUpdatedProductInfo) {
            toast.error('Product details are missing. Please complete the base product form.');
            setStep(1);
            return;
        }

        const prices = variantList
            .map((variant) => variant.price)
            .filter((price): price is number => typeof price === 'number' && Number.isFinite(price));
        if (prices.length !== variantList.length || prices.length === 0) {
            toast.error('Please add at least one variant with a valid price.');
            return;
        }

        const newProduct: updateProductFormRequest = {
            auth_vendor_id: Number(user?.id),
            variants: variantList,
            id: newUpdatedProductInfo?.id || 1,
            attribute_set_id: newUpdatedProductInfo.attribute_set_id,
            title: newUpdatedProductInfo.title || '',
            description: newUpdatedProductInfo.description || '',
            product_image: newUpdatedProductInfo.product_image || '',
            meta_title: newUpdatedProductInfo.meta_title,
            meta_key: newUpdatedProductInfo.meta_key,
            meta_description: newUpdatedProductInfo.meta_description,
            max_price: Math.max(...prices),
            min_price: Math.min(...prices),
            status: PRODUCT_STATUSES.ACTIVE,
        };
        const result = await dispatch(updateProduct(newProduct));
        if (updateProduct.fulfilled.match(result)) {
            setVariantList([])
            setSelectedVariant(null)
            setNewUpdatedProductInfo(null)
            navigate("product")
            toast.success(result.payload.message);
            return;
        } else if (updateProduct.rejected.match(result)) {
            toast.error(result.payload?.message || 'Failed');
            return;
        }
        return;
    };

    useEffect(() => {
        fetchData(Number(id));
    }, [id]);

    if (isLoading) return <FullLoader />
    if (!selectedProduct) return <div className="block text-center text-2xl my-7">Something Went Wrong</div>
    const productToEdit = { ...selectedProduct, attribute_set_id: selectedProduct.attribute_set?.id || APP_CONFIG.DEFAULT_ATTRIBUTE_SET_ID }

    return (
        <div className="w-full flex flex-col gap-4 my-4">
            <div className="flex gap-2 justify-between">
                <span className="text-3xl font-bold">{UI_TEXT.PRODUCT.EDIT_TITLE}</span>
                <Link to={ROUTES.PRODUCT} className="p-2 rounded-md font-semibold hover:underline text-sm">
                    <span className="text-lg">{UI_TEXT.COMMON.BACK_ARROW} </span>{' '}
                    {UI_TEXT.PRODUCT.BACK_TO_LISTING}
                </Link>
            </div>

            <div className="w-full flex flex-row gap-2 border-b border-red-300 ">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`p-4 hover:cursor-pointer ${step == 1 && 'bg-red-100'}`}
                >
                    {UI_TEXT.PRODUCT_FORM.BASE_INFO}
                </button>
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={`p-4 hover:cursor-pointer ${step == 2 && 'bg-red-100'}`}
                >
                    {UI_TEXT.PRODUCT_FORM.VARIANT_INFO}
                </button>
            </div>

            {step === 1 && (
                <BaseProductForm
                    btnText={UI_TEXT.PRODUCT_FORM.NEXT}
                    onSubmit={handleProductBtn}
                    updateFormValues={productToEdit}
                />
            )}
            {step === 2 && (
                <>
                    <BaseVariantForm onSubmit={handleVariantFormBtn} updateFormValues={selectedVariant} />
                    <BaseVariantTable
                        variantList={variantList}
                        editHandler={handleEditVariant}
                        deleteHandler={handleDeleteVariant}
                    />
                </>
            )}
            {step === 2 && variantList.length > 0 && (
                <button
                    type="button"
                    onClick={handleEditingProduct}
                    className="inline-flex self-end w-fit bg-blue-200 rounded-md px-5 py-2 hover:cursor-pointer hover:opacity-70"
                >
                    {UI_TEXT.PRODUCT_FORM.ADD_PRODUCT}
                </button>
            )}
        </div>
    );
}

export default ProductEditPage
