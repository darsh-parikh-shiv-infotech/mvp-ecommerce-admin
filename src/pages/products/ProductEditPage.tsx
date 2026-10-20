import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
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
  PRODUCT_STATE_ERROR_MESSAGES,
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
import type { UiVariant } from '../../store/slices/product/productSlice';

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
  const { selectedProduct, isLoading, error } = useAppSelector((state) => state.product);
  const [variantList, setVariantList] = useState<Partial<UiVariant>[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Partial<UiVariant> | null>(null);

  const dispatch = useAppDispatch();

  const handleProductBtn = (formValues: ProductFormValues) => {
    setNewUpdatedProductInfo({ ...formValues });
    setStep(2);
  };
  const handleEditVariant = (id: number | undefined) => {
    if (id) {
      const findVariant: Partial<UiVariant> | null =
        variantList.find((variant) => variant.id == id || variant.ui_id == id) || null;
      if (findVariant) {
        setSelectedVariant({ ...findVariant, isEditing: true });
        return;
      }
    }

    toast.error(UI_TEXT.VARIANT.FALLBACK_EDIT_ERROR);
    return;
  };
  const handleVariantFormBtn = (formValues: Partial<UiVariant | null>) => {
    if (formValues && formValues.isEditing == false) {
      const newVariant: Partial<UiVariant> = {
        ui_id: new Date().getTime(),
        title: formValues.title,
        fake_price: formValues.fake_price,
        price: formValues.price,
        on_hand_quantity: formValues.on_hand_quantity,
        available_quantity: formValues.available_quantity,
        code: formValues.code,
        product_variant_image: formValues.product_variant_image,
        status: PRODUCT_STATUSES.ACTIVE,
      };
      setVariantList([...variantList, newVariant]);
      setSelectedVariant(null);
    }
    if (formValues && formValues.isEditing == true) {
      const matchesVariant = (variant: Partial<UiVariant>) =>
        formValues.id !== undefined
          ? variant.id === formValues.id
          : variant.ui_id === formValues.ui_id;
      const variantExists = variantList.some(matchesVariant);
      if (variantExists) {
        setVariantList(
          variantList.map((variant) =>
            matchesVariant(variant) ? { ...variant, ...formValues } : variant,
          ),
        );
        setSelectedVariant(null);
      }
    }
    return;
  };
  const handleDeleteVariant = async (variant_id: number | undefined) => {
    if (variant_id) {
      const result = await dispatch(
        deleteVariant({ product_id: Number(id), variant_id: variant_id }),
      );
      if (deleteVariant.rejected.match(result)) {
        toast.error(result.payload?.message || API_ERROR_MESSAGES.UNEXPECTED);
        return;
      }
      if (deleteVariant.fulfilled.match(result)) {
        const findVariant: Partial<UiVariant> | null =
          variantList.find((variant) => variant.id == variant_id) || null;
        if (findVariant) {
          setVariantList([...variantList.filter((variant) => variant.id != variant_id)]);
          if (selectedVariant?.id == variant_id) setSelectedVariant(null);
          return;
        }
        toast.error('Error While Updating Ui');
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
          const variants =
            product?.variants?.map((variant) => {
              return {
                ...variant,
                price: Number(variant.price) || 0,
                fake_price: Number(variant.fake_price) || 0,
              };
            }) || [];
          setNewUpdatedProductInfo({
            ...product,
            attribute_set_id:
              selectedProduct?.attribute_set?.id || APP_CONFIG.DEFAULT_ATTRIBUTE_SET_ID,
          });
          setVariantList(variants || []);
        }
      }
      return;
    }
    if (id && !isNaN(Number(id))) {
      fetchData(Number(id));
    } else {
      toast.error(VALIDATION_MESSAGES.INVALID_REQUEST_AT_LOAD);
      navigate('/product');
    }
  }, [id]);

  if (!id) {
    return <Navigate to={ROUTES.CATEGORY} />;
  }
  if (isLoading) return <FullLoader />;
  if (!selectedProduct)
    return (
      <div className="w-full min-h-[30vw] overflow-hidden flex items-center">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex flex-col gap-4 items-center text-center text-2xl font-semibold">
            {error || PRODUCT_STATE_ERROR_MESSAGES.FETCH_FAILED}
            <Link
              to={'/product'}
              className="text-sm w-fit bg-blue-300 rounded-md hover:opacity-70 hover:cursor-pointer p-3"
            >
              Return To Product Home Page
            </Link>
          </div>
        </div>
      </div>
    );

  const productToEdit = {
    ...selectedProduct,
    attribute_set_id: selectedProduct.attribute_set?.id || APP_CONFIG.DEFAULT_ATTRIBUTE_SET_ID,
  };

  return (
    <div className="w-full flex flex-col gap-4 my-4">
      <div className="flex gap-2 justify-between">
        <span className="text-3xl font-bold">{UI_TEXT.PRODUCT.EDIT_TITLE}</span>
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-md font-semibold hover:underline hover:cursor-pointer text-sm"
        >
          <span className="text-lg">{UI_TEXT.COMMON.BACK_ARROW} </span>{' '}
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
          {UI_TEXT.PRODUCT_FORM.EDIT_PRODUCT}
        </button>
      )}
    </div>
  );
}

export default ProductEditPage;
