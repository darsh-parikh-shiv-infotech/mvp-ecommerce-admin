import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import { toast } from 'react-toastify';

import { viewProduct } from '../../store/slices/product/productThunk';
import { API_ENDPOINTS, APP_CONFIG, ROUTES, UI_TEXT } from '../../utils/constants/constants';
import type { product } from '../../store/slices/product/productSlice';
import { RequestStatus } from '../../store/slices/common';

import Spinner from '../../components/common/Spinner';
import moment from 'moment';
import BaseVariantTable from '../../components/BaseVariantTable';

type NavigationState = {
  from?: string;
};

const ProductSingleViewPage = () => {
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

  const { selectedProduct, requests } = useAppSelector((state) => state.product);
  const { status: fetchSingleStatus, error } = requests.fetchSingle;
  const isLoading = fetchSingleStatus === RequestStatus.LOADING;

  const dispatch = useAppDispatch();
  const fetchData = useCallback(
    async (id: number) => {
      if (id) {
        const result = await dispatch(viewProduct({ id }));
        if (viewProduct.rejected.match(result)) {
          toast.error(result.payload?.message || UI_TEXT.PRODUCT.FETCH_SINGLE_FAILED);
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    fetchData(Number(id));
  }, [fetchData, id]);

  return (
    <div className='mt-7'>
      <div className="flex flex-col-reverse md:flex-row md:justify-between gap-2">
          <span className="text-lg font-semibold md:text-2xl text-center">{UI_TEXT.PRODUCT.VIEW_TITLE}</span>

          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 self-end md:block p-2 rounded-md hover:underline hover:cursor-pointer text-xs "
          >
            <span className="text-md">{UI_TEXT.COMMON.BACK_ARROW} </span>{' '}
            {UI_TEXT.PRODUCT.BACK_TO_LISTING}
          </button>
        </div>
      {isLoading && <Spinner />}
      {!isLoading && !error && selectedProduct && <ProductTable product={selectedProduct} />}

      {!isLoading && !error && selectedProduct?.variants && (
        <BaseVariantTable variantList={selectedProduct?.variants || []} />
      )}
    </div>
  );
};

interface ProductTableProp {
  product: product;
}
const ProductTable = ({ product }: ProductTableProp) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[30vw_50vw] gap-7 mt-5">
      <div className="w-full h-full flex items-center justify-center">
        <img
          className="w-full h-full shrink-0"
          src={
            import.meta.env.VITE_API_SERVER_BASE_URL +
            API_ENDPOINTS.UPLOADED_FILE_BASE_PATH +
            product.product_image
          }
          alt={UI_TEXT.COMMON.PREVIEW_IMAGE_ALT}
        />
      </div>
      <div className="w-full my-2">
        <table className="w-full text-2xs md:text-sm text-body">
          <caption className="text-start font-bold underline text-sm md:text-lg mb-2">
            {UI_TEXT.PRODUCT.DETAILS}
          </caption>
          <tbody>
            <tr className="text-left">
              <th className="w-1/3 font-semibold py-2">{UI_TEXT.PRODUCT.TITLE_LABEL}</th>
              <td className="w-2/3 py-2">{product.title}</td>
            </tr>
            <tr className="text-left">
              <th className="w-1/3 py-2 font-semibold">{UI_TEXT.PRODUCT.ATTRIBUTE}</th>
              <td className="w-2/3 py-2">{product.attribute_set?.name}</td>
            </tr>
            <tr className="text-left">
              <th className="w-1/3 py-2 font-semibold">{UI_TEXT.PRODUCT.DESCRIPTION_LABEL}</th>
              <td className="w-2/3">{product.description}</td>
            </tr>
            <tr className="text-left">
              <th className="w-1/3 py-2 font-semibold">{UI_TEXT.PRODUCT.STATUS_LABEL}</th>
              <td className="w-2/3">
                {product.status &&
                  product.status.toString().charAt(0).toUpperCase() +
                    product.status.toString().slice(1)}
              </td>
            </tr>
            <tr className="text-left">
              <th className="w-1/3 py-2 font-semibold">{UI_TEXT.PRODUCT.CREATED_ON_LABEL}</th>
              <td className="w-2/3">
                {moment(new Date(product.createdAt).getTime()).utc().format(APP_CONFIG.DATE_FORMAT)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductSingleViewPage;
