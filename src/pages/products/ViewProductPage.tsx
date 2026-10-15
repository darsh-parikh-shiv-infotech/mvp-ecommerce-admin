import { Link, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../utils/hooks/hooks"
import { viewProduct } from "../../store/slices/product/productThunk"
import { toast } from "react-toastify"
import { useEffect } from "react"
import Spinner from "../../components/common/Spinner"
import moment from "moment"

const ViewProductPage = () => {
  const { id } = useParams()

  const { selectedProduct, isLoading, error } = useAppSelector((state) => state.product)
  const dispatch = useAppDispatch()
  async function fetchData(id: number) {
    if (id) {
      const result = await dispatch(viewProduct({ id }))
      if (viewProduct.rejected.match(result)) {
        toast.error(result.payload?.message || "Fetching Single Category Data Failed")
      }
    }
    return
  }

  useEffect(() => {
    fetchData(Number(id))
  }, [id])

  return (
    <div className="mt-2 mx-5">
      <div className="flex gap-2 justify-between">
        <span className="text-3xl font-bold">View Product</span>
        <Link to={"/product"} className="p-2 rounded-md font-semibold hover:underline text-sm">
          <span className="text-lg">&larr; {" "}</span> Back To Listing
        </Link>
      </div>
      {
        isLoading && <Spinner />
      }
      {
        !isLoading && !error && selectedProduct &&
        <div className="w-full grid grid-cols-1 md:grid-cols-[30vw_50vw] mt-5">
          <div className="w-full min-h-50 flex items-center justify-center">
            <img className="shrink-0" src={selectedProduct.product_image} alt="preview-img" />
          </div>
          <div className="w-full my-2">
            <table className="w-full text-sm text-body">
              <caption className="text-start font-bold underline text-lg mb-2">Product Details</caption>
              <tr className="text-left">
                <th className="w-1/3 font-semibold py-2">Title :</th>
                <td className="w-2/3 py-2">{selectedProduct.title}</td>
              </tr>
              <tr className="text-left">
                <th className="w-1/3 py-2 font-semibold">Attribute :</th>
                <td className="w-2/3 py-2">{selectedProduct.attribute_set[0].name}</td>
              </tr>
              <tr className="text-left">
                <th className="w-1/3 py-2 font-semibold">Description :</th>
                <td className="w-2/3">{selectedProduct.description}</td>
              </tr>
              <tr className="text-left">
                <th className="w-1/3 py-2 font-semibold">Status :</th>
                <td className="w-2/3">
                  {selectedProduct.status && selectedProduct.status.toString().charAt(0).toUpperCase() + selectedProduct.status.toString().slice(1)}
                </td>
              </tr>
              <tr className="text-left">
                <th className="w-1/3 py-2 font-semibold">Created On :</th>
                <td className="w-2/3">
                  {moment(new Date(selectedProduct.createdAt).getTime()).utc().format("DD-MM-YYYY")}
                </td>
              </tr>
            </table>
          </div>
        </div>
      }

      {
        !isLoading && !error && selectedProduct?.variants &&
        <table className="w-full text-sm mt-7 text-left rtl:text-right text-body">
          <caption className="text-start text-lg my-2 font-semibold">Variant Details</caption>
          <thead className="text-sm text-body bg-red-100 border-b border-default-medium">
            <tr>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Variant Title
              </th>
              <th scope="col" className="px-6 py-3">
                Variant Code
              </th>
              <th scope="col" className="px-6 py-3">
                Variant Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Variant Price
              </th>
              <th scope="col" className="px-6 py-3">
                Variant Status
              </th>
            </tr>
          </thead>
          <tbody>
            {
              selectedProduct.variants.map((variant, index) => {
                return <tr key={variant.id} className={`${index % 2 == 0 ? "bg-neutral-primary-soft" : "bg-red-50"} border-b border-default hover:bg-neutral-secondary-medium`}>
                  <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {variant.product_variant_image
                      ? <img className="w-25 h-15 shrink-0" src={variant.product_variant_image[0]} alt="preview-img" />
                      : <span className="opacity-45">No Image</span>
                    }
                  </th>
                  <td className="px-6 py-4">
                    {variant.title}
                  </td>
                  <td className="px-6 py-4">
                    {variant.code}
                  </td>
                  <td className="px-6 py-4">
                    {variant.available_quantity}
                  </td>
                  <td className="px-6 py-4">
                    {variant.price}
                  </td>
                  <td className="flex flex-row gap-2 px-6 py-4">
                    {variant.status && variant.status.toString().charAt(0).toUpperCase() + variant.status.toString().slice(1)}
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      }
    </div >
  )
}

export default ViewProductPage
