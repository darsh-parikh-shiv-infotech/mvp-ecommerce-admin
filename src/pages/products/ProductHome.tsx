import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/hooks/hooks";
import { changeStatusProduct, listProduct } from "../../store/slices/product/productThunk";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import moment from "moment";

const ProductHome = () => {
  const { data, currentPage, numberOfRows, pageSize, totalItems, totalPages, isLoading, error } = useAppSelector((state) => state.product)
  const dispatch = useAppDispatch();

  const [page, setPage] = useState<number>(1);

  async function fetchData(page: number) {
    const result = await dispatch(listProduct({ "limit": 5, "page": page, "search": "", "sortKey": "id", "sortValue": "asc" }))
    if (listProduct.rejected.match(result)) {
      toast.error(result.payload?.message || "Fetching Category Data Failed")
    }
  }
  async function toggleStatusHandler(id:number,status:"active"|"inactive"){
    const result = await dispatch(changeStatusProduct({id,status}))
    if (changeStatusProduct.rejected.match(result)) {
      toast.error(result.payload?.message || "Changing Product Status Failed")
    }
    if (changeStatusProduct.fulfilled.match(result)) {
      fetchData(page)
    }
  }
  useEffect(() => {
    fetchData(page)
  }, [page])
  const pageNumbers = [];

  const endRange = Math.min(currentPage + 3, totalPages);
  const startRange = Math.max(1, currentPage - 1)

  for (let i = startRange; i <= endRange; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <>
      <span className="inline-block text-2xl font-semibold my-2 leading-5">View All Product</span>
      <div className="relative overflow-x-auto mt-5 bg-red-50 shadow-xs rounded-base border border-default">
        <div className="flex md:justify-end my-2 mx-2">
          <Link to={"/product/add"} className="bg-blue-200 p-2 rounded-md font-semibold text-sm">Add New Product</Link>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-red-100 border-b border-default-medium">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product Id
              </th>
              <th scope="col" className="px-6 py-3">
                Product Image
              </th>
              <th scope="col" className="px-6 py-3">
                Product Title
              </th>
              <th scope="col" className="px-6 py-3">
                Attribute Set Name
              </th>
              <th scope="col" className="px-6 py-3">
                Product Status
              </th>
              <th scope="col" className="px-6 py-3">
                Created On
              </th>
              <th scope="col" className="px-6 py-3">
                Action
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
                    <img src={row.product_image} className="shrink-0" alt="preview-img" />
                  </th>
                  <td className="px-6 py-4">
                    {row.title}
                  </td>
                  <td className="px-6 py-4">
                    {row.attribute_set.name}
                  </td>
                  <td className="px-6 py-4">
                    {row.status ? row.status.toString().charAt(0).toUpperCase() + row.status.toString().slice(1) : ""}
                  </td>
                  <td className="px-6 py-4">
                    {moment(new Date(row.createdAt).getTime()).utc().format("DD-MM-YYYY")}
                  </td>
                  <td className="flex flex-col items-start gap-2 px-6 py-4">
                    <div className="flex flex-col md:flex-row gap-2">
                      <Link to={`/product/view/${row.id}`} className="font-medium text-fg-success hover:underline">View</Link>
                      <Link to={`/product/edit/${row.id}`} className="font-medium text-fg-brand hover:underline">Edit</Link>
                    </div>
                    <button className="font-medium text-red-600 hover:underline hover:cursor-pointer" onClick={()=>toggleStatusHandler(row.id,row.status=="active"?"inactive":"active")}>Change Status</button>
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
        {
          isLoading == false && error == null &&
          <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-body mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-heading">
              {((currentPage * pageSize) - numberOfRows) + 1}
              -
              {(currentPage * pageSize)}
            </span>
              {" "} of {" "}
              <span className="font-semibold text-heading">
                {totalItems}
              </span>
            </span>
            <ul className="flex -space-x-px text-sm">
              <li>
                <button onClick={() => setPage((p) => p - 1)} disabled={currentPage == 1} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-base text-sm px-3 h-9">Previous</button>
              </li>
              {pageNumbers.map((page, index) => (
                <li key={index}>
                  <button onClick={() => setPage(page)} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm px-3 h-9">
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => setPage((p) => p + 1)} disabled={currentPage == totalPages} className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-base text-sm px-3 h-9">Next</button>
              </li>
            </ul>
          </nav>
        }
      </div>
    </>
  );
};

export default ProductHome;
