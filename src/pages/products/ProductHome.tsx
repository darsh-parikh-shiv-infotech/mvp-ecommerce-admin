import { useCallback, useEffect, useState } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useAppDispatch, useAppSelector, useDebounce } from '../../utils/hooks/hooks';
import { changeStatusProduct, listProduct } from '../../store/slices/product/productThunk';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import moment from 'moment';
import {
  API_ENDPOINTS,
  APP_CONFIG,
  FORM_DEFAULTS,
  LIST_QUERY_DEFAULTS,
  PRODUCT_STATUSES,
  ROUTES,
  UI_TEXT,
} from '../../utils/constants/constants';

const ProductHome = () => {
  const { data, currentPage, numberOfRows, pageSize, totalItems, totalPages, isLoading, error } =
    useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const openProduct = (id: string) => {
    navigate(ROUTES.PRODUCT_VIEW(id), {
      state: {
        from: location.pathname + location.search,
      },
    });
  };
  const editProduct = (id: string) => {
    navigate(ROUTES.PRODUCT_EDIT(id), {
      state: {
        from: location.pathname + location.search,
      },
    });
  };

  const search = params.get('search') ?? LIST_QUERY_DEFAULTS.SEARCH;
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearchInput = useDebounce(searchInput, 500);

  type SortOrder = 'desc' | 'asc';
  const sortParam = params.get('order');
  const sortValue: SortOrder =
    sortParam === 'desc' || sortParam === 'asc' ? sortParam : LIST_QUERY_DEFAULTS.SORT_ASCENDING;

  const parsedPage = Number(params.get('page'));

  const filters = {
    limit: APP_CONFIG.PAGE_SIZE,
    page:
      Number.isInteger(parsedPage) && parsedPage >= APP_CONFIG.FIRST_PAGE
        ? parsedPage
        : APP_CONFIG.FIRST_PAGE,
    search,
    sortKey: params.get('sort') || LIST_QUERY_DEFAULTS.SORT_KEY,
    sortValue,
  };
  const updateFilters = useCallback(
    (updates: Record<string, string>, resetPage = true) => {
      setParams((currentParams) => {
        const next = new URLSearchParams(currentParams);

        Object.entries(updates).forEach(([key, value]) => {
          if (value) {
            next.set(key, value);
          } else {
            next.delete(key);
          }
        });

        if (resetPage && updates.page === undefined) {
          next.set('page', String(APP_CONFIG.FIRST_PAGE));
        }
        return next;
      });
    },
    [setParams],
  );

  const fetchData = useCallback(async () => {
    const result = await dispatch(
      listProduct({
        limit: APP_CONFIG.PAGE_SIZE,
        page: filters.page,
        search: filters.search,
        sortKey: filters.sortKey,
        sortValue: filters.sortValue,
      }),
    );
    if (listProduct.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.PRODUCT.FETCH_PRODUCTS_FAILED);
    }
  }, [dispatch, filters.page, filters.search, filters.sortKey, filters.sortValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback(
    (nextSearch: string) => updateFilters({ search: nextSearch }),
    [updateFilters],
  );

  async function toggleStatusHandler(
    id: number,
    status: (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES],
  ) {
    const result = await dispatch(changeStatusProduct({ id, status }));
    if (changeStatusProduct.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.PRODUCT.STATUS_CHANGE_FAILED);
    }
    if (changeStatusProduct.fulfilled.match(result)) {
      fetchData();
    }
  }

  const handleSort = (field: string) => {
    if (filters.sortKey === field) {
      updateFilters({ order: filters.sortValue === 'asc' ? 'desc' : 'asc' });
    } else {
      updateFilters({ sort: field, order: 'asc' });
    }
  };
  const renderSortIcon = (field: string) => {
    const isActive = filters.sortKey === field;
    const isAsc = filters.sortValue === 'asc';

    const activeColor = '#333333';
    const inactiveColor = '#61dafb';

    return (
      <div className="flex flex-col items-center gap-0 my-1 leading-none">
        <FaSortUp
          className="block shrink-0"
          size={15}
          color={isActive && isAsc ? activeColor : inactiveColor}
        />
        <FaSortDown
          className="-mt-3 block shrink-0"
          size={15}
          color={isActive && !isAsc ? activeColor : inactiveColor}
        />
      </div>
    );
  };

  useEffect(() => {
    if (searchInput === debouncedSearchInput && debouncedSearchInput.trim() !== search) {
      handleSearch(debouncedSearchInput.trim());
    }
  }, [debouncedSearchInput, handleSearch, search, searchInput]);
  return (
    <>
      <div className="relative overflow-x-auto my-4">
        <span className="text-3xl font-bold">{UI_TEXT.PRODUCT.VIEW_ALL}</span>

        <div className="flex gap-2 justify-end my-4 mx-2">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search..."
            className="text-sm md:text-md h-10 px-4 py-2 rounded-md border border-black/30 focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Link
            to={ROUTES.PRODUCT_ADD}
            className="bg-blue-200 p-2 rounded-md font-semibold text-sm"
          >
            {UI_TEXT.PRODUCT.ADD}
          </Link>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-red-100 border-b border-default-medium">
            <tr>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex flex-row gap-3 ">
                  {UI_TEXT.PRODUCT.ID}
                  {renderSortIcon('id')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.IMAGE}
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex flex-row gap-3 ">
                  {UI_TEXT.PRODUCT.TITLE}
                  {renderSortIcon('title')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.PRODUCT.ATTRIBUTE_SET_NAME}
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex flex-row gap-3 ">
                  {UI_TEXT.PRODUCT.STATUS}
                  {renderSortIcon('status')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex flex-row gap-3 ">
                  {UI_TEXT.COMMON.CREATED_ON}
                  {renderSortIcon('createdAt')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                {UI_TEXT.COMMON.ACTION}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7}>
                  <Spinner />
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td colSpan={7} className="font-semibold text-center p-2">
                  {error}
                </td>
              </tr>
            )}
            {!isLoading &&
              data &&
              data.map((row, index) => {
                return (
                  <tr
                    key={row.id}
                    className={`${index % 2 == 0 ? 'bg-neutral-primary-soft' : 'bg-red-50'} border-b border-default hover:bg-neutral-secondary-medium`}
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-center text-heading whitespace-nowrap"
                    >
                      {row.id}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                    >
                      <img
                        src={
                          import.meta.env.VITE_API_SERVER_BASE_URL +
                          API_ENDPOINTS.UPLOADED_FILE_BASE_PATH +
                          row.product_image
                        }
                        className="w-25 h-15 shrink-0"
                        alt={UI_TEXT.COMMON.PREVIEW_IMAGE_ALT}
                      />
                    </td>
                    <td className="px-6 py-4">{row.title}</td>
                    <td className="px-6 py-4">{row.attribute_set?.name}</td>
                    <td className="px-6 py-4">
                      {row.status
                        ? row.status.toString().charAt(0).toUpperCase() +
                          row.status.toString().slice(1)
                        : FORM_DEFAULTS.EMPTY_STRING}
                    </td>
                    <td className="px-6 py-4">
                      {moment(new Date(row.createdAt).getTime()).utc().format('DD-MM-YYYY')}
                    </td>
                    <td className="flex flex-col items-start gap-2 px-6 py-4">
                      <div className="flex flex-col md:flex-row gap-2">
                        <button
                          type="button"
                          className="font-medium text-fg-success hover:underline hover:cursor-pointer"
                          onClick={() => openProduct(row.id.toString())}
                        >
                          {UI_TEXT.PRODUCT.VIEW}
                        </button>
                        <button
                          className="font-medium text-fg-brand hover:underline hover:cursor-pointer"
                          onClick={() => editProduct(row.id.toString())}
                        >
                          {UI_TEXT.PRODUCT.EDIT}
                        </button>
                      </div>
                      <button
                        className="font-medium text-red-600 hover:underline hover:cursor-pointer"
                        onClick={() =>
                          toggleStatusHandler(
                            row.id,
                            row.status === PRODUCT_STATUSES.ACTIVE
                              ? PRODUCT_STATUSES.INACTIVE
                              : PRODUCT_STATUSES.ACTIVE,
                          )
                        }
                      >
                        {UI_TEXT.PRODUCT.CHANGE_STATUS}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {isLoading == false && error == null && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            numberOfRows={numberOfRows}
            totalItems={totalItems}
            onPageChange={(page) => updateFilters({ page: String(page) }, false)}
          />
        )}
      </div>
    </>
  );
};

export default ProductHome;
