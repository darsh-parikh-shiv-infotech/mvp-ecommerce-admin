import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, useDebounce } from '../../utils/hooks/hooks';
import { deleteCategory, listCategory } from '../../store/slices/category/categoryThunk';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { APP_CONFIG, LIST_QUERY_DEFAULTS, ROUTES, UI_TEXT } from '../../utils/constants/constants';
import { FaSortUp, FaSortDown } from 'react-icons/fa6';
import ReusableModal from '../../components/common/ReusableModal';
import { RequestStatus } from '../../store/slices/common';

const CategoryHomePage = () => {
  const { data, currentPage, numberOfRows, pageSize, totalItems, totalPages, requests } =
    useAppSelector((state) => state.category);
  const { status: statusFetchAll, error: errorFetchAll } = requests.fetchAll;
  const { status: statusDelete } = requests.delete;

  const isLoading =
    statusFetchAll === RequestStatus.LOADING || statusDelete === RequestStatus.LOADING;

  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const editCategory = (id: string) => {
    navigate(ROUTES.CATEGORY_EDIT(id), {
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    const result = await dispatch(
      listCategory({
        limit: APP_CONFIG.PAGE_SIZE,
        page: filters.page,
        search: filters.search,
        sortKey: filters.sortKey,
        sortValue: filters.sortValue,
      }),
    );
    if (listCategory.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.PRODUCT.FETCH_CATEGORIES_FAILED);
    }
  }, [dispatch, filters.page, filters.search, filters.sortKey, filters.sortValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback(
    (nextSearch: string) => updateFilters({ search: nextSearch }),
    [updateFilters],
  );

  const deleteHandler = async (id: number) => {
    const result = await dispatch(deleteCategory({ id }));
    if (deleteCategory.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.CATEGORY.DELETE_FAILED);
    }
    if (deleteCategory.fulfilled.match(result)) {
      toast.success(result.payload.message || UI_TEXT.CATEGORY.DELETED);
      fetchData();
    }
    return;
  };
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
      <span className="inline-block text-lg md:text-3xl font-bold my-2">{UI_TEXT.CATEGORY.VIEW_ALL}</span>

      <div className="bg-red-50 shadow-xs rounded-base border border-default">
        <div className="flex md:justify-end items-center gap-2 my-2 mx-2">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search..."
            className="text-2xs md:text-md h-10 px-4 py-2 rounded-md border border-black/30 focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          <Link
            to={ROUTES.CATEGORY_ADD}
            className="bg-blue-200 text-center p-2 rounded-md font-semibold text-[9px] md:text-sm"
          >
            {UI_TEXT.CATEGORY.ADD}
          </Link>
        </div>
        <div className='relative overflow-x-auto mt-5 '>
          <table className="w-full text-2xs md:text-sm text-left rtl:text-right text-body">
            <thead className="text-2xs md:text-sm text-body bg-red-100 border-b border-default-medium">
              <tr>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('id')}>
                  <div className="flex flex-row gap-3 items-center text-center ">
                    {UI_TEXT.CATEGORY.ID}
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex flex-row gap-3 items-center text-center ">
                    {UI_TEXT.CATEGORY.TABLE_NAME}
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex flex-row gap-3 items-center text-center">
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
                  <td colSpan={4}>
                    <Spinner />
                  </td>
                </tr>
              )}
              {!isLoading && errorFetchAll && (
                <tr>
                  <td colSpan={4} className="font-semibold text-center p-2">
                    {errorFetchAll}
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
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                      >
                        {row.id}
                      </th>
                      <td className="px-6 py-4">{row.name}</td>
                      <td className="px-6 py-4">
                        {moment(new Date(row.createdAt).getTime())
                          .utc()
                          .format(APP_CONFIG.DATE_FORMAT)}
                      </td>
                      <td className="flex flex-row gap-2 px-6 py-4">
                        <button
                          type="button"
                          onClick={() => editCategory(row.id.toString())}
                          className="font-medium text-fg-brand hover:underline hover:cursor-pointer"
                        >
                          {UI_TEXT.PRODUCT.EDIT}
                        </button>
                        <button
                          className="font-medium text-red-600 hover:underline hover:cursor-pointer"
                          onClick={() => {
                            setIsDeleting(row.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          {UI_TEXT.CATEGORY.DELETE}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {isLoading == false && errorFetchAll == null && (
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

      <ReusableModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setIsDeleting(null);
          return;
        }}
      >
        <div className="w-full flex flex-col my-5 gap-4 items-center">
          <span className="text-md md:text-2xl text-center font-semibold">Are You Sure You Want To Delete?</span>

          <div className="w-full flex my-2 justify-center gap-2">
            <button
              onClick={() => {
                if (isDeleting) deleteHandler(isDeleting);

                setIsDeleting(null);
                setShowDeleteModal(false);
              }}
              className="w-fit text-xs md:text-md bg-red-600 text-white px-3 py-2 rounded-lg hover:cursor-pointer hover:opacity-70"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setIsDeleting(null);
                return;
              }}
              className="w-fit text-xs md:text-md bg-blue-600 text-white px-3 py-2 rounded-lg hover:cursor-pointer hover:opacity-70"
            >
              Cancel
            </button>
          </div>
        </div>
      </ReusableModal>
    </>
  );
};

export default CategoryHomePage;
