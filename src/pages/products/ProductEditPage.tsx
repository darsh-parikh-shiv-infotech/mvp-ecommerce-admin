import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import {
  deleteVariant,
  updateProduct,
  viewProduct,
  type updateProductFormRequest,
} from '../../store/slices/product/productThunk';
import { toast } from 'react-toastify';
import {
  ROUTES,
  UI_TEXT,
  APP_CONFIG,
  PRODUCT_STATUSES,
  API_ERROR_MESSAGES,
  VALIDATION_MESSAGES,
} from '../../utils/constants/constants';
import { useEffect, useState } from 'react';
import FullLoader from '../../components/common/FullLoader';
import BaseProductForm, {
  type newProductInfoProp,
  type ProductFormValues,
} from '../../components/BaseProductForm';
import BaseVariantForm from '../../components/BaseVariantForm';
import BaseVariantTable from '../../components/BaseVariantTable';
import type { EditableVariant } from '../../store/slices/product/productSlice';
import type { VariantFormValues } from '../../components/BaseVariantForm';
import {
  createVariantClientId,
  toEditableVariants,
  toProductVariantPayload,
} from '../../utils/common/productVariants';
import { RequestStatus } from '../../store/slices/common';

type NavigationState = {
  from?: string;
};

function ProductEditPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as NavigationState | null;
  const handleBack = () => {
    if (state?.from) {
      navigate(state.from);
    } else {
      navigate(ROUTES.PRODUCT);
    }
  };

  const [step, setStep] = useState<1 | 2>(1);
  const [isEnabled, setIsEnabled] = useState(true);
  const [newUpdatedProductInfo, setNewUpdatedProductInfo] = useState<newProductInfoProp>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { selectedProduct, requests } = useAppSelector((state) => state.product);
  const { status: fetchSingleStatus } = requests.fetchSingle;
  const { status: updateStatus } = requests.update;
  const { status: deleteVariantStatus } = requests.deleteVariant;

  const isLoading =
    fetchSingleStatus === RequestStatus.LOADING ||
    updateStatus === RequestStatus.LOADING ||
    deleteVariantStatus === RequestStatus.LOADING;
  const [variantList, setVariantList] = useState<EditableVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<EditableVariant | null>(null);

  const dispatch = useAppDispatch();

  const handleProductBtn = (formValues: ProductFormValues) => {
    setNewUpdatedProductInfo({ ...formValues });
    setStep(2);
  };
  const handleEditVariant = (variant: EditableVariant) => {
    setSelectedVariant(variant);
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
  const handleDeleteVariant = async (variant: EditableVariant) => {
    if (variant.id === undefined) {
      setVariantList((currentVariants) =>
        currentVariants.filter((item) => item.clientId !== variant.clientId),
      );
      if (selectedVariant?.clientId === variant.clientId) setSelectedVariant(null);
      return;
    }

    if (variant.id !== undefined) {
      const result = await dispatch(
        deleteVariant({ product_id: Number(id), variant_id: variant.id }),
      );
      if (deleteVariant.rejected.match(result)) {
        toast.error(result.payload?.message || API_ERROR_MESSAGES.UNEXPECTED);
        return;
      }
      if (deleteVariant.fulfilled.match(result)) {
        setVariantList((currentVariants) =>
          currentVariants.filter((item) => item.clientId !== variant.clientId),
        );
        if (selectedVariant?.clientId === variant.clientId) setSelectedVariant(null);
      }
    }
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
      variants: variantList.map(toProductVariantPayload),
      id: Number(id),
      attribute_set_id: newUpdatedProductInfo.attribute_set_id,
      title: newUpdatedProductInfo.title || '',
      description: newUpdatedProductInfo.description || '',
      product_image: newUpdatedProductInfo.product_image || '',
      meta_title: newUpdatedProductInfo.meta_title,
      meta_key: newUpdatedProductInfo.meta_key,
      meta_description: newUpdatedProductInfo.meta_description,
      max_price: Number(newUpdatedProductInfo.max_price) || 0,
      min_price: Number(newUpdatedProductInfo.min_price) || 0,
      status: PRODUCT_STATUSES.ACTIVE,
    };
    const result = await dispatch(updateProduct(newProduct));
    if (updateProduct.fulfilled.match(result)) {
      setVariantList([]);
      setSelectedVariant(null);
      setNewUpdatedProductInfo(null);
      navigate('/product');
      toast.success(result.payload.message);
      return;
    } else if (updateProduct.rejected.match(result)) {
      toast.error(result.payload?.message || 'Failed');
      return;
    }
    return;
  };

  useEffect(() => {
    async function fetchData(id: number) {
      if (id) {
        const result = await dispatch(viewProduct({ id }));
        if (viewProduct.rejected.match(result)) {
          toast.error(result.payload?.message || UI_TEXT.PRODUCT.FETCH_SINGLE_FAILED);
        } else if (viewProduct.fulfilled.match(result)) {
          const product = result.payload.data;
          const variants = toEditableVariants(product?.variants).map((variant) => ({
            ...variant,
            price: Number(variant.price) || 0,
            fake_price: Number(variant.fake_price) || 0,
          }));
          setNewUpdatedProductInfo({
            ...product,
            attribute_set_id: product?.attribute_set?.id || APP_CONFIG.DEFAULT_ATTRIBUTE_SET_ID,
          });
          setVariantList(variants);
        }
      }
      return;
    }
    if (id && !isNaN(Number(id))) {
      fetchData(Number(id));
    } else {
      toast.error(VALIDATION_MESSAGES.INVALID_REQUEST_AT_LOAD);
      navigate(ROUTES.PRODUCT);
    }
  }, [dispatch, id, navigate]);

  if (!id) {
    return <Navigate to={ROUTES.PRODUCT} />;
  }
  if (isLoading) return <FullLoader />;
  else if (!isLoading && !selectedProduct) return <Navigate to={ROUTES.PRODUCT} />;
  else if (!isLoading && selectedProduct) {
    const productToEdit = {
      ...selectedProduct,
      attribute_set_id: selectedProduct.attribute_set?.id || APP_CONFIG.DEFAULT_ATTRIBUTE_SET_ID,
    };
    return (
      <div className="w-full flex flex-col gap-4 my-4">
        <div className="flex flex-col-reverse md:flex-row md:justify-between gap-2">
          <span className="text-lg font-semibold md:text-2xl text-center">
            {UI_TEXT.PRODUCT.EDIT_TITLE}
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
            className={`p-4 hover:cursor-pointer ${step == 1 && 'bg-red-100'}`}
          >
            {UI_TEXT.PRODUCT_FORM.BASE_INFO}
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!isEnabled}
            className={`p-4 hover:cursor-pointer ${step == 2 && 'bg-red-100'} disabled:opacity-50`}
          >
            {UI_TEXT.PRODUCT_FORM.VARIANT_INFO}
          </button>
        </div>

        {step === 1 && (
          <BaseProductForm
            btnText={UI_TEXT.PRODUCT_FORM.NEXT}
            onSubmit={handleProductBtn}
            updateFormValues={productToEdit}
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
          />
        )}
        {step === 2 && (
          <div className="flex flex-col-reverse md:flex-col gap-2">
            <BaseVariantForm onSubmit={handleVariantFormBtn} updateFormValues={selectedVariant} />
            <BaseVariantTable
              variantList={variantList}
              editHandler={handleEditVariant}
              deleteHandler={handleDeleteVariant}
            />
          </div>
        )}
        {step === 2 && variantList.length > 0 && (
          <button
            type="button"
            onClick={handleEditingProduct}
            className="inline-flex self-end w-fit bg-blue-200 rounded-md px-5 py-2 hover:cursor-pointer hover:opacity-70"
          >
            {UI_TEXT.PRODUCT_FORM.EDIT_PRODUCT}
          </button>
        )}
      </div>
    );
  }
}

export default ProductEditPage;
