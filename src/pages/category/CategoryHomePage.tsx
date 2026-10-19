import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../utils/hooks/hooks"
import { deleteCategory, listCategory } from "../../store/slices/category/categoryThunk";
import Spinner from "../../components/common/Spinner";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from 'moment';
import { APP_CONFIG, LIST_QUERY_DEFAULTS, ROUTES, UI_TEXT } from "../../utils/constants/constants";

const CategoryHomePage = () => {
  const { data, currentPage, numberOfRows, pageSize, totalItems, totalPages, isLoading, error } = useAppSelector((state) => state.category)
  const dispatch = useAppDispatch();

  const [page, setPage] = useState<number>(APP_CONFIG.FIRST_PAGE);

  async function fetchData(page: number) {
    const result = await dispatch(listCategory({
      limit: APP_CONFIG.PAGE_SIZE,
      page,
      search: LIST_QUERY_DEFAULTS.SEARCH,
      sortKey: LIST_QUERY_DEFAULTS.SORT_KEY,
      sortValue: LIST_QUERY_DEFAULTS.SORT_ASCENDING,
    }))
    if (listCategory.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.CATEGORY.FETCH_FAILED)
    }
  }
  const deleteHandler = async (id: number) => {
    const result = await dispatch(deleteCategory({ id }))
    if (deleteCategory.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.CATEGORY.DELETE_FAILED)
    }
    if (deleteCategory.fulfilled.match(result)) {
      toast.success(result.payload.message || UI_TEXT.CATEGORY.DELETED)
      fetchData(page)
    }
    return
  }
  useEffect(() => {
    fetchData(page)
  }, [page])
  const pageNumbers = [];

  const endRange = Math.min(currentPage + APP_CONFIG.PAGE_RANGE_AFTER_CURRENT, totalPages);
  const startRange = Math.max(APP_CONFIG.FIRST_PAGE, currentPage - APP_CONFIG.PAGE_RANGE_BEFORE_CURRENT)

  for (let i = startRange; i <= endRange; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <span className="inline-block text-2xl font-semibold my-2 leading-5">{UI_TEXT.CATEGORY.VIEW_ALL}</span>

      <div className="relative overflow-x-auto mt-5 bg-red-50 shadow-xs rounded-base border border-default">
        <div className="flex justify-end my-2 mx-2">
          <Link to={ROUTES.CATEGORY_ADD} className="bg-blue-200 p-2 rounded-md font-semibold text-sm">{UI_TEXT.CATEGORY.ADD}</Link>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-red-100 border-b border-default-medium">
            <tr>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.CATEGORY.ID}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.CATEGORY.TABLE_NAME}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.COMMON.CREATED_ON}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.COMMON.ACTION}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading && <tr><td colSpan={4}><Spinner /></td></tr>
            }
            {
              !isLoading && error && <tr><td colSpan={4} className="font-semibold text-center p-2">{error}</td></tr>
            }
            {
              !isLoading && data && data.map((row, index) => {
                return <tr key={row.id} className={`${index % 2 == 0 ? "bg-neutral-primary-soft" : "bg-red-50"} border-b border-default hover:bg-neutral-secondary-medium`}>
                  <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {row.id}
                  </th>
                  <td className="px-6 py-4">
                    {row.name}
                  </td>
                  <td className="px-6 py-4">
                    {moment(new Date(row.createdAt).getTime()).utc().format(APP_CONFIG.DATE_FORMAT)}
                  </td>
                  <td className="flex flex-row gap-2 px-6 py-4">
                    <Link to={ROUTES.CATEGORY_EDIT(row.id)} className="font-medium text-fg-brand hover:underline">{UI_TEXT.PRODUCT.EDIT}</Link>
                    <button className="font-medium text-red-600 hover:underline hover:cursor-pointer" onClick={() => deleteHandler(row.id)}>{UI_TEXT.CATEGORY.DELETE}</button>
                  </td>
                </tr>
              })
            }

          </tbody>

        </table>
        {
          isLoading == false && error == null &&
          <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label={UI_TEXT.COMMON.TABLE_NAVIGATION}>
            <span className="text-sm font-normal text-body mb-4 md:mb-0 block w-full md:inline md:w-auto">{UI_TEXT.COMMON.SHOWING} <span className="font-semibold text-heading">
              {((currentPage * pageSize) - numberOfRows) + 1}
              {UI_TEXT.COMMON.RANGE_SEPARATOR}
              {(currentPage * pageSize)}
            </span>
              {" "}{UI_TEXT.COMMON.OF}{" "}
              <span className="font-semibold text-heading">
                {totalItems}
              </span>
            </span>
            <ul className="flex -space-x-px text-sm">
              <li>
                <button onClick={() => setPage((p) => p - 1)} disabled={currentPage == APP_CONFIG.FIRST_PAGE} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-base text-sm px-3 h-9">{UI_TEXT.COMMON.PREVIOUS}</button>
              </li>
              {pageNumbers.map((page, index) => (
                <li key={index}>
                  <button onClick={() => setPage(page)} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm px-3 h-9">
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => setPage((p) => p + 1)} disabled={currentPage == totalPages} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-base text-sm px-3 h-9">{UI_TEXT.COMMON.NEXT}</button>
              </li>
            </ul>
          </nav>
        }
      </div>

    </>
  )
}

export default CategoryHomePage
