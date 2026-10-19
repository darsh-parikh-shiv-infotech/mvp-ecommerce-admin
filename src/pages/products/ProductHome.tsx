import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks/hooks";
import { changeStatusProduct, listProduct } from "../../store/slices/product/productThunk";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import moment from "moment";
import {
  APP_CONFIG,
  FORM_DEFAULTS,
  LIST_QUERY_DEFAULTS,
  PRODUCT_STATUSES,
  ROUTES,
  UI_TEXT,
} from "../../utils/constants/constants";

const ProductHome = () => {
  const { data, currentPage, numberOfRows, pageSize, totalItems, totalPages, isLoading, error } = useAppSelector((state) => state.product)
  const dispatch = useAppDispatch();

  const [page, setPage] = useState<number>(APP_CONFIG.FIRST_PAGE);

  async function fetchData(page: number) {
    const result = await dispatch(listProduct({
      limit: APP_CONFIG.PAGE_SIZE,
      page,
      search: LIST_QUERY_DEFAULTS.SEARCH,
      sortKey: LIST_QUERY_DEFAULTS.SORT_KEY,
      sortValue: LIST_QUERY_DEFAULTS.SORT_ASCENDING,
    }))
    if (listProduct.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.PRODUCT.FETCH_CATEGORIES_FAILED)
    }
  }
  async function toggleStatusHandler(
    id: number,
    status: (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES],
  ) {
    const result = await dispatch(changeStatusProduct({ id, status }))
    if (changeStatusProduct.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.PRODUCT.STATUS_CHANGE_FAILED)
    }
    if (changeStatusProduct.fulfilled.match(result)) {
      fetchData(page)
    }
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

      <div className="relative overflow-x-auto my-4">
        <div className="flex gap-2 justify-between my-4 mx-2">
          <span className="text-3xl font-bold">{UI_TEXT.PRODUCT.VIEW_ALL}</span>
          <Link to={ROUTES.PRODUCT_ADD} className="bg-blue-200 p-2 rounded-md font-semibold text-sm">{UI_TEXT.PRODUCT.ADD}</Link>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-red-100 border-b border-default-medium">
            <tr>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.ID}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.IMAGE}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.TITLE}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.ATTRIBUTE_SET_NAME}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.STATUS}
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
              isLoading && <tr><td colSpan={7}><Spinner /></td></tr>
            }
            {
              !isLoading && error && <tr><td colSpan={7} className="font-semibold text-center p-2">{error}</td></tr>
            }
            {
              !isLoading && data && data.map((row, index) => {
                return <tr key={row.id} className={`${index % 2 == 0 ? "bg-neutral-primary-soft" : "bg-red-50"} border-b border-default hover:bg-neutral-secondary-medium`}>
                  <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {row.id}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    <img src={row.product_image} className="shrink-0" alt={UI_TEXT.COMMON.PREVIEW_IMAGE_ALT} />
                  </th>
                  <td className="px-6 py-4">
                    {row.title}
                  </td>
                  <td className="px-6 py-4">
                    {row.attribute_set.name}
                  </td>
                  <td className="px-6 py-4">
                    {row.status ? row.status.toString().charAt(0).toUpperCase() + row.status.toString().slice(1) : FORM_DEFAULTS.EMPTY_STRING}
                  </td>
                  <td className="px-6 py-4">
                    {moment(new Date(row.createdAt).getTime()).utc().format("DD-MM-YYYY")}
                  </td>
                  <td className="flex flex-col items-start gap-2 px-6 py-4">
                    <div className="flex flex-col md:flex-row gap-2">
                        <Link to={ROUTES.PRODUCT_VIEW(row.id)} className="font-medium text-fg-success hover:underline">{UI_TEXT.PRODUCT.VIEW}</Link>
                        <Link to={ROUTES.PRODUCT_EDIT(row.id)} className="font-medium text-fg-brand hover:underline">{UI_TEXT.PRODUCT.EDIT}</Link>
                    </div>
                    <button className="font-medium text-red-600 hover:underline hover:cursor-pointer" onClick={() => toggleStatusHandler(row.id, row.status === PRODUCT_STATUSES.ACTIVE ? PRODUCT_STATUSES.INACTIVE : PRODUCT_STATUSES.ACTIVE)}>{UI_TEXT.PRODUCT.CHANGE_STATUS}</button>
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
  );
};

export default ProductHome;
