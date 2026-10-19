import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BaseProductForm, {
  type newProductInfoProp,
  type ProductFormValues,
} from '../../components/BaseProductForm';
import BaseVariantForm from '../../components/BaseVariantForm';
import type { variant } from '../../store/slices/product/productSlice';
import BaseVariantTable from '../../components/BaseVariantTable';
import { PRODUCT_STATUSES, ROUTES, UI_TEXT } from '../../utils/constants/constants';
import { toast } from 'react-toastify';
import { addProduct, type productFormRequest } from '../../store/slices/product/productThunk';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import FullLoader from '../../components/common/FullLoader';

export interface ISelectedVariant extends variant {
  isEditing: boolean;
}

const AddProductPage = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [secondStepEnable, setSecondStepEnable] = useState(false);
  const [newProductInfo, setNewProductInfo] = useState<newProductInfoProp>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.product)
  const [variantList, setVariantList] = useState<Partial<variant>[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Partial<ISelectedVariant> | null>(null);

  const handleProductBtn = (formValues: ProductFormValues) => {
    setNewProductInfo({ ...formValues });
    setSecondStepEnable(true);
    setStep(2);
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
  const handleAddNewProduct = async () => {
    if (!Number(user?.id)) {
      toast.error('Unable to identify the current user.');
      return;
    }

    if (!newProductInfo) {
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

    const newProduct: productFormRequest = {
      auth_vendor_id: Number(user?.id),
      variants: variantList,
      attribute_set_id: newProductInfo.attribute_set_id,
      title: newProductInfo.title || '',
      description: newProductInfo.description || '',
      product_image: newProductInfo.product_image || '',
      meta_title: newProductInfo.meta_title,
      meta_key: newProductInfo.meta_key,
      meta_description: newProductInfo.meta_description,
      max_price: Math.max(...prices),
      min_price: Math.min(...prices),
      status: PRODUCT_STATUSES.ACTIVE,
    };
    const result = await dispatch(addProduct(newProduct));
    if (addProduct.fulfilled.match(result)) {
      setVariantList([])
      setSelectedVariant(null)
      setNewProductInfo(null)
      navigate("product")
      toast.success(result.payload.message);
      return;
    } else if (addProduct.rejected.match(result)) {
      toast.error(result.payload?.message || 'Failed');
      return;
    }
    return;
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
  const handleDeleteVariant = (id: number | undefined) => {
    if (id) {
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

  if(isLoading) return <FullLoader/>
  return (
    <div className="w-full flex flex-col gap-4 my-4">
      <div className="flex gap-2 justify-between">
        <span className="text-3xl font-bold">{UI_TEXT.PRODUCT.ADD_TITLE}</span>
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
          className={`p-4 hover:cursor-pointer ${step == 2 && 'bg-red-100'} disabled:opacity-20 disabled:bg-none`}
          disabled={!secondStepEnable}
        >
          {UI_TEXT.PRODUCT_FORM.VARIANT_INFO}
        </button>
      </div>

      {step === 1 && (
        <BaseProductForm
          btnText={UI_TEXT.PRODUCT_FORM.NEXT}
          onSubmit={handleProductBtn}
          updateFormValues={newProductInfo}
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
          onClick={handleAddNewProduct}
          className="inline-flex self-end w-fit bg-blue-200 rounded-md px-5 py-2 hover:cursor-pointer hover:opacity-70"
        >
          {UI_TEXT.PRODUCT_FORM.ADD_PRODUCT}
        </button>
      )}
    </div>
  );
};

export default AddProductPage;
