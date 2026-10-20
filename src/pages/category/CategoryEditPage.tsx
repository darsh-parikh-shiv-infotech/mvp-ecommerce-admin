import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import { useEffect } from 'react';
import { editCategory, viewSingleCategory } from '../../store/slices/category/categoryThunk';
import { toast } from 'react-toastify';
import BaseCategoryForm from '../../components/BaseCategoryForm';
import Spinner from '../../components/common/Spinner';
import {
  CATEGORY_STATE_ERROR_MESSAGES,
  ROUTES,
  UI_TEXT,
  VALIDATION_MESSAGES,
} from '../../utils/constants/constants';
import FullLoader from '../../components/common/FullLoader';

type NavigationState = {
  from?: string;
};

const CategoryEditPage = () => {
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
  const { isLoading, selectedCategory, error } = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchData(id: number) {
      const result = await dispatch(viewSingleCategory({ id }));
      if (viewSingleCategory.rejected.match(result)) {
        toast.error(result.payload?.message || UI_TEXT.CATEGORY.FETCH_FAILED);
        return navigate(ROUTES.CATEGORY);
      }
    }
    if (id && !isNaN(Number(id))) {
      fetchData(Number(id));
    } else {
      toast.error(VALIDATION_MESSAGES.INVALID_REQUEST_AT_LOAD);
      navigate('/category');
    }
  }, [id]);

  const editFormSubmitHandler = async (name: string) => {
    const result = await dispatch(editCategory({ id: Number(id), name }));
    if (editCategory.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.CATEGORY.UPDATE_FAILED);
    }
    if (editCategory.fulfilled.match(result)) {
      toast.success(result.payload.message || UI_TEXT.CATEGORY.UPDATED);
      navigate(ROUTES.CATEGORY);
    }
    return;
  };

  if (!id) {
    return <Navigate to={ROUTES.CATEGORY} />;
  }
  if (isLoading) return <FullLoader />;
  if (!selectedCategory)
    return (
      <div className="w-full min-h-[30vw] overflow-hidden flex items-center">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex flex-col gap-4 items-center text-center text-2xl font-semibold">
            {error || CATEGORY_STATE_ERROR_MESSAGES.FETCH_FAILED}
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

  return (
    <div className="w-full max-w-screen-sm mx-auto my-9">
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 justify-between">
          <span className="text-2xl">{UI_TEXT.CATEGORY.EDIT_FORM_TITLE}</span>

          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-md font-semibold hover:underline hover:cursor-pointer text-sm"
          >
            <span className="text-lg">{UI_TEXT.COMMON.BACK_ARROW} </span>{' '}
            {UI_TEXT.PRODUCT.BACK_TO_LISTING}
          </button>
        </div>
        {isLoading && <Spinner />}
        {!isLoading && selectedCategory && (
          <BaseCategoryForm
            loading={isLoading}
            onSubmit={editFormSubmitHandler}
            updateValue={selectedCategory}
            submitBtnText={UI_TEXT.CATEGORY.EDIT}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryEditPage;
