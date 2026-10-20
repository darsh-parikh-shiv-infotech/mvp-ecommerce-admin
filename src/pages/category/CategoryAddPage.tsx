import { toast } from 'react-toastify';
import BaseCategoryForm from '../../components/BaseCategoryForm';
import { addCategory } from '../../store/slices/category/categoryThunk';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import { useNavigate } from 'react-router-dom';
import { ROUTES, UI_TEXT } from '../../utils/constants/constants';

const CategoryAddPage = () => {
  const { isLoading } = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const addFormSubmitHandler = async (name: string) => {
    const result = await dispatch(addCategory({ name }));
    if (addCategory.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.CATEGORY.DELETE_FAILED);
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
        <span className="text-2xl">{UI_TEXT.CATEGORY.ADD_FORM_TITLE}</span>
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
