import { toast } from "react-toastify"
import BaseCategoryForm from "../../components/BaseCategoryForm"
import { addCategory } from "../../store/slices/category/categoryThunk"
import { useAppDispatch, useAppSelector } from "../../utils/hooks/hooks"
import { useNavigate } from "react-router-dom"

const CategoryAddPage = () => {
  const { isLoading } = useAppSelector((state) => (state.category))
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const addFormSubmitHandler = async (name: string) => {
    const result = await dispatch(addCategory({ name }))
    if (addCategory.rejected.match(result)) {
      toast.error(result.payload?.message || "Deleting Category Operation Failed")
    }
    if (addCategory.fulfilled.match(result)) {
      toast.success(result.payload.message || "Category Added")
      navigate("/category")
    }
    return
  }
  return (
    <div className="w-full max-w-screen-sm mx-auto my-7">
      <div className="flex flex-col gap-5">
        <span className="text-2xl">Add New Category Form</span>
        <BaseCategoryForm loading={isLoading} onSubmit={addFormSubmitHandler} submitBtnText="Add New Category" />
      </div>
    </div>
  )
}

export default CategoryAddPage
