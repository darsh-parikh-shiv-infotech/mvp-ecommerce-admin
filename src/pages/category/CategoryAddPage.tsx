import { toast } from 'react-toastify';
import BaseCategoryForm from '../../components/BaseCategoryForm';
import { addCategory } from '../../store/slices/category/categoryThunk';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, UI_TEXT } from '../../utils/constants/constants';
import { RequestStatus } from '../../store/slices/common';

type NavigationState = {
  from?: string;
};

const CategoryAddPage = () => {
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


  const { requests } = useAppSelector((state) => state.category);
  const { status } = requests.create;
  const isLoading = status === RequestStatus.LOADING;

  const dispatch = useAppDispatch();
  const addFormSubmitHandler = async (name: string) => {
    const result = await dispatch(addCategory({ name }));
    if (addCategory.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.CATEGORY.ADD_FAILED);
    }
    if (addCategory.fulfilled.match(result)) {
      toast.success(result.payload.message || UI_TEXT.CATEGORY.ADDED);
      navigate(ROUTES.CATEGORY);
    }
    return;
  };
  return (
    <div className="w-full max-w-screen-sm mx-auto my-7">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col-reverse md:flex-row md:justify-between gap-2">
          <span className="text-lg font-semibold md:text-2xl text-center">{UI_TEXT.CATEGORY.ADD_FORM_TITLE}</span>

          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 self-end md:block p-2 rounded-md hover:underline hover:cursor-pointer text-xs "
          >
            <span className="text-md">{UI_TEXT.COMMON.BACK_ARROW} </span>{' '}
            {UI_TEXT.PRODUCT.BACK_TO_LISTING}
          </button>
        </div>
        <BaseCategoryForm
          loading={isLoading}
          onSubmit={addFormSubmitHandler}
          submitBtnText={UI_TEXT.CATEGORY.ADD}
        />
      </div>
    </div>
  );
};

export default CategoryAddPage;
