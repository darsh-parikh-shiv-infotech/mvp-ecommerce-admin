import type { EditableVariant, variant } from '../store/slices/product/productSlice';
import { API_ENDPOINTS, UI_TEXT } from '../utils/constants/constants';

interface BaseVariantTableProp {
  variantList: (EditableVariant | variant)[] | null;
  editHandler?: (variant: EditableVariant) => void;
  deleteHandler?: (variant: EditableVariant) => void;
}
const BaseVariantTable = ({ variantList, editHandler, deleteHandler }: BaseVariantTableProp) => {
  if (!variantList || variantList.length == 0) return;
  return (
    <div className='flex flex-col mt-4 gap-2'>
      <span className=''>{UI_TEXT.PRODUCT.VARIANT_DETAILS}</span>
      <div className='relative overflow-x-auto shadow-xs rounded-base border border-default'>
        <table className="w-full text-2xs md:text-sm text-left rtl:text-right text-body">
          <thead className="text-2xs md:text-sm text-body bg-red-100 border-b border-default-medium">
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
              {editHandler && deleteHandler && <th>{UI_TEXT.COMMON.ACTION}</th>}
            </tr>
          </thead>
          <tbody>
            {variantList.map((variant, index) => {
              return (
                <tr
                  key={'clientId' in variant ? variant.clientId : `server-${variant.id}`}
                  className={`${index % 2 == 0 ? 'bg-neutral-primary-soft' : 'bg-red-50'} border-b border-default hover:bg-neutral-secondary-medium`}
                >
                  <td scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {variant.product_variant_image?.length ? (
                      <img
                        className="w-25 h-15 shrink-0"
                        src={
                          variant.product_variant_image[0].startsWith('http')
                            ? variant.product_variant_image[0]
                            : import.meta.env.VITE_API_SERVER_BASE_URL +
                            API_ENDPOINTS.UPLOADED_FILE_BASE_PATH +
                            variant.product_variant_image[0]
                        }
                        alt={UI_TEXT.COMMON.PREVIEW_IMAGE_ALT}
                      />
                    ) : (
                      <span className="opacity-45">{UI_TEXT.COMMON.NO_IMAGE}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{variant.title}</td>
                  <td className="px-6 py-4">{variant.code}</td>
                  <td className="px-6 py-4">{variant.available_quantity}</td>
                  <td className="px-6 py-4">{Number(variant.price) || 0}</td>
                  <td className="px-6 py-4">
                    {variant.status &&
                      variant.status.toString().charAt(0).toUpperCase() +
                      variant.status.toString().slice(1)}
                  </td>
                  {editHandler && deleteHandler && (
                    <td>
                      <div className="flex flex-col md:flex-row gap-2 px-2">
                        <button
                          type="button"
                          onClick={() => {
                            if ('clientId' in variant) editHandler(variant);
                          }}
                          className="font-medium text-fg-brand hover:underline hover:cursor-pointer"
                        >
                          {UI_TEXT.COMMON.EDIT}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if ('clientId' in variant) deleteHandler(variant);
                          }}
                          className="font-medium text-fg-danger hover:underline hover:cursor-pointer"
                        >
                          {UI_TEXT.COMMON.DELETE}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BaseVariantTable;
