import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../utils/hooks/hooks";
import { useEffect } from "react";
import { editCategory, viewSingleCategory } from "../../store/slices/category/categoryThunk";
import { toast } from "react-toastify";
import BaseCategoryForm from "../../components/BaseCategoryForm";
import Spinner from "../../components/common/Spinner";

const CategoryEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoading, selectedCategory } = useAppSelector((state) => state.category)
    const dispatch = useAppDispatch()


    useEffect(() => {
        async function fetchData(id: number) {
            const result = await dispatch(viewSingleCategory({ id }))
            if (viewSingleCategory.rejected.match(result)) {
                toast.error(result.payload?.message || "Fetching Category Data Failed")
                return navigate("/category")
            }
        }
        if (id) {
            fetchData(Number(id))
        }
    }, [id])

    if (!id) {
        return <Navigate to={"/category"} />
    }


    const editFormSubmitHandler = async (name: string) => {
        const result = await dispatch(editCategory({ id: Number(id), name }))
        if (editCategory.rejected.match(result)) {
            toast.error(result.payload?.message || "Updating Category Operation Failed")
        }
        if (editCategory.fulfilled.match(result)) {
            toast.success(result.payload.message || "Category Updated")
            navigate("/category")
        }
        return
    }

    return (
        <div className="w-full max-w-screen-sm mx-auto my-9">
            <div className="flex flex-col gap-5">
                <span className="text-2xl">Edit Category Form</span>
                {
                    isLoading && <Spinner />
                }
                {
                    !isLoading && selectedCategory &&
                    <BaseCategoryForm loading={isLoading} onSubmit={editFormSubmitHandler} updateValue={selectedCategory} submitBtnText="Edit Category" />
                }
            </div>
        </div>
    )
}

export default CategoryEditPage
