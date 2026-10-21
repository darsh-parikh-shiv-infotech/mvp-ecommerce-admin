import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BaseProductForm, {
  type newProductInfoProp,
  type ProductFormValues,
} from '../../components/BaseProductForm';
import BaseVariantForm from '../../components/BaseVariantForm';
import type { VariantFormValues } from '../../components/BaseVariantForm';
import type { EditableVariant } from '../../store/slices/product/productSlice';
import BaseVariantTable from '../../components/BaseVariantTable';
import { PRODUCT_STATUSES, ROUTES, UI_TEXT } from '../../utils/constants/constants';
import { toast } from 'react-toastify';
import { addProduct, type productFormRequest } from '../../store/slices/product/productThunk';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import FullLoader from '../../components/common/FullLoader';
import { createVariantClientId, toProductVariantPayload } from '../../utils/common/productVariants';
import { RequestStatus } from '../../store/slices/common';

type NavigationState = {
  from?: string;
};
const ProductAddPage = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as NavigationState | null;
  const handleBack = () => {
    if (state?.from) {
      navigate(state.from);
    } else {
      navigate(ROUTES.CATEGORY);
    }
  };

  const [secondStepEnable, setSecondStepEnable] = useState(false);
  const [newProductInfo, setNewProductInfo] = useState<newProductInfoProp>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { requests } = useAppSelector((state) => state.product);
  const { status: createStatus } = requests.create;
  const { status: fetchAllAttributesStatus } = requests.fetchAllAttributes;

  const isLoading =
    createStatus === RequestStatus.LOADING || fetchAllAttributesStatus === RequestStatus.LOADING;

  const [variantList, setVariantList] = useState<EditableVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<EditableVariant | null>(null);

  const handleProductBtn = (formValues: ProductFormValues) => {
    setNewProductInfo({ ...formValues });
    setSecondStepEnable(true);
    setStep(2);
  };
  const handleVariantFormBtn = (formValues: VariantFormValues) => {
    if (formValues.clientId) {
      setVariantList((currentVariants) =>
        currentVariants.map((variant) =>
          variant.clientId === formValues.clientId ? { ...variant, ...formValues } : variant,
        ),
      );
    } else {
      setVariantList((currentVariants) => [
        ...currentVariants,
        {
          ...formValues,
          clientId: createVariantClientId(),
          status: PRODUCT_STATUSES.ACTIVE,
        },
      ]);
    }
    setSelectedVariant(null);
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
      variants: variantList.map(toProductVariantPayload),
      attribute_set_id: newProductInfo.attribute_set_id,
      title: newProductInfo.title || '',
      description: newProductInfo.description || '',
      product_image: newProductInfo.product_image || '',
      meta_title: newProductInfo.meta_title,
      meta_key: newProductInfo.meta_key,
      meta_description: newProductInfo.meta_description,
      max_price: newProductInfo.max_price || 0,
      min_price: newProductInfo.min_price || 0,
      status: PRODUCT_STATUSES.ACTIVE,
    };
    const result = await dispatch(addProduct(newProduct));
    if (addProduct.fulfilled.match(result)) {
      setVariantList([]);
      setSelectedVariant(null);
      setNewProductInfo(null);
      navigate('/product');
      toast.success(result.payload.message);
      return;
    } else if (addProduct.rejected.match(result)) {
      toast.error(result.payload?.message || 'Failed');
      return;
    }
    return;
  };
  const handleEditVariant = (variant: EditableVariant) => {
    setSelectedVariant(variant);
  };
  const handleDeleteVariant = (variant: EditableVariant) => {
    setVariantList((currentVariants) =>
      currentVariants.filter((item) => item.clientId !== variant.clientId),
    );
    if (selectedVariant?.clientId === variant.clientId) setSelectedVariant(null);
  };

  if (isLoading) return <FullLoader />;
  return (
    <div className="w-full flex flex-col gap-4 my-4">
      <div className="flex flex-col-reverse md:flex-row md:justify-between gap-2">
        <span className="text-lg font-semibold md:text-2xl text-center">
          {UI_TEXT.PRODUCT.ADD_TITLE}
        </span>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1 self-end md:block p-2 rounded-md hover:underline hover:cursor-pointer text-xs "
        >
          <span className="text-md">{UI_TEXT.COMMON.BACK_ARROW} </span>{' '}
          {UI_TEXT.PRODUCT.BACK_TO_LISTING}
        </button>
      </div>

      <div className="w-full flex flex-row gap-2 border-b border-red-300 ">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`text-xs lg:text-md p-4 hover:cursor-pointer ${step == 1 && 'bg-red-100'}`}
        >
          {UI_TEXT.PRODUCT_FORM.BASE_INFO}
        </button>
        <button
          type="button"
          onClick={() => setStep(2)}
          className={`text-xs lg:text-md p-4 hover:cursor-pointer ${step == 2 && 'bg-red-100'} disabled:opacity-20 disabled:bg-none`}
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
          isEnabled={true}
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

export default ProductAddPage;
