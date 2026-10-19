import { Link, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../utils/hooks/hooks"
import { viewProduct } from "../../store/slices/product/productThunk"
import { toast } from "react-toastify"
import { useEffect } from "react"
import Spinner from "../../components/common/Spinner"
import moment from "moment"
import { APP_CONFIG, ROUTES, UI_TEXT } from "../../utils/constants/constants";

const ViewProductPage = () => {
  const { id } = useParams()

  const { selectedProduct, isLoading, error } = useAppSelector((state) => state.product)
  const dispatch = useAppDispatch()
  async function fetchData(id: number) {
    if (id) {
      const result = await dispatch(viewProduct({ id }))
      if (viewProduct.rejected.match(result)) {
        toast.error(result.payload?.message || UI_TEXT.PRODUCT.FETCH_SINGLE_FAILED)
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
        <span className="text-3xl font-bold">{UI_TEXT.PRODUCT.VIEW_TITLE}</span>
        <Link to={ROUTES.PRODUCT} className="p-2 rounded-md font-semibold hover:underline text-sm">
          <span className="text-lg">{UI_TEXT.COMMON.BACK_ARROW}{" "}</span> {UI_TEXT.PRODUCT.BACK_TO_LISTING}
        </Link>
      </div>
      {
        isLoading && <Spinner />
      }
      {
        !isLoading && !error && selectedProduct &&
        <div className="w-full grid grid-cols-1 md:grid-cols-[30vw_50vw] mt-5">
          <div className="w-full min-h-50 flex items-center justify-center">
            <img className="shrink-0" src={selectedProduct.product_image} alt={UI_TEXT.COMMON.PREVIEW_IMAGE_ALT} />
          </div>
          <div className="w-full my-2">
            <table className="w-full text-sm text-body">
              <caption className="text-start font-bold underline text-lg mb-2">{UI_TEXT.PRODUCT.DETAILS}</caption>
              <tr className="text-left">
                <th className="w-1/3 font-semibold py-2">{UI_TEXT.PRODUCT.TITLE_LABEL}</th>
                <td className="w-2/3 py-2">{selectedProduct.title}</td>
              </tr>
              <tr className="text-left">
                <th className="w-1/3 py-2 font-semibold">{UI_TEXT.PRODUCT.ATTRIBUTE}</th>
                <td className="w-2/3 py-2">{selectedProduct.attribute_set.name}</td>
              </tr>
              <tr className="text-left">
                <th className="w-1/3 py-2 font-semibold">{UI_TEXT.PRODUCT.DESCRIPTION_LABEL}</th>
                <td className="w-2/3">{selectedProduct.description}</td>
              </tr>
              <tr className="text-left">
                <th className="w-1/3 py-2 font-semibold">{UI_TEXT.PRODUCT.STATUS_LABEL}</th>
                <td className="w-2/3">
                  {selectedProduct.status && selectedProduct.status.toString().charAt(0).toUpperCase() + selectedProduct.status.toString().slice(1)}
                </td>
              </tr>
              <tr className="text-left">
                <th className="w-1/3 py-2 font-semibold">{UI_TEXT.PRODUCT.CREATED_ON_LABEL}</th>
                <td className="w-2/3">
                  {moment(new Date(selectedProduct.createdAt).getTime()).utc().format(APP_CONFIG.DATE_FORMAT)}
                </td>
              </tr>
            </table>
          </div>
        </div>
      }

      {
        !isLoading && !error && selectedProduct?.variants &&
        <table className="w-full text-sm mt-7 text-left rtl:text-right text-body">
          <caption className="text-start text-lg my-2 font-semibold">{UI_TEXT.PRODUCT.VARIANT_DETAILS}</caption>
          <thead className="text-sm text-body bg-red-100 border-b border-default-medium">
            <tr>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.IMAGE}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.VARIANT_TITLE}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.VARIANT_CODE}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.VARIANT_QUANTITY}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.VARIANT_PRICE}
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.VARIANT_STATUS}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              selectedProduct.variants.map((variant, index) => {
                return <tr key={variant.id} className={`${index % 2 == 0 ? "bg-neutral-primary-soft" : "bg-red-50"} border-b border-default hover:bg-neutral-secondary-medium`}>
                  <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {variant.product_variant_image
                      ? <img className="w-25 h-15 shrink-0" src={variant.product_variant_image[0]} alt={UI_TEXT.COMMON.PREVIEW_IMAGE_ALT} />
                      : <span className="opacity-45">{UI_TEXT.COMMON.NO_IMAGE}</span>
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
