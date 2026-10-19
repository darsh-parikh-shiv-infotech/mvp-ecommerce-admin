import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, useDebounce } from '../../utils/hooks/hooks';
import { deleteCategory, listCategory } from '../../store/slices/category/categoryThunk';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { APP_CONFIG, LIST_QUERY_DEFAULTS, ROUTES, UI_TEXT } from '../../utils/constants/constants';
import { FaSortUp, FaSortDown } from 'react-icons/fa6';
import ReusableModal from '../../components/common/ReusableModal';

const CategoryHomePage = () => {
  const { data, currentPage, numberOfRows, pageSize, totalItems, totalPages, isLoading, error } =
    useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();

  const [searchInput, setSearchInput] = useState('');
  const [sortKey, setSortKey] = useState<string>(LIST_QUERY_DEFAULTS.SORT_KEY);
  const [sortValue, setSortValue] = useState<'desc' | 'asc' | null>(
    LIST_QUERY_DEFAULTS.SORT_ASCENDING,
  );

  const debouncedSearchInput = useDebounce<string>(searchInput, 500);
  const [page, setPage] = useState<number>(APP_CONFIG.FIRST_PAGE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const fetchData = useCallback(
    async (page: number, search: string, sortKey: string, sortValue: 'desc' | 'asc' | null) => {
      const result = await dispatch(
        listCategory({
          limit: APP_CONFIG.PAGE_SIZE,
          page,
          search,
          sortKey,
          sortValue,
        }),
      );
      if (listCategory.rejected.match(result)) {
        toast.error(result.payload?.message || UI_TEXT.CATEGORY.FETCH_FAILED);
      }
    },
    [dispatch],
  );
  useEffect(() => {
    if (searchInput !== debouncedSearchInput) return;
    fetchData(
      page,
      debouncedSearchInput.trim() || LIST_QUERY_DEFAULTS.SEARCH,
      sortKey || LIST_QUERY_DEFAULTS.SORT_KEY,
      sortValue || LIST_QUERY_DEFAULTS.SORT_ASCENDING,
    );
  }, [debouncedSearchInput, fetchData, page, searchInput, sortKey, sortValue]);

  const deleteHandler = async (id: number) => {
    const result = await dispatch(deleteCategory({ id }));
    if (deleteCategory.rejected.match(result)) {
      toast.error(result.payload?.message || UI_TEXT.CATEGORY.DELETE_FAILED);
    }
    if (deleteCategory.fulfilled.match(result)) {
      toast.success(result.payload.message || UI_TEXT.CATEGORY.DELETED);
      fetchData(
        page,
        debouncedSearchInput.trim() || LIST_QUERY_DEFAULTS.SEARCH,
        sortKey || LIST_QUERY_DEFAULTS.SORT_KEY,
        sortValue || LIST_QUERY_DEFAULTS.SORT_ASCENDING,
      );
    }
    return;
  };
  const handleSort = (field: string) => {
    if (sortKey === field) {
      setSortValue(sortValue === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(field);
      setSortValue('asc');
    }
  };
  const renderSortIcon = (field: string) => {
    const isActive = sortKey === field;
    const isAsc = sortValue === 'asc';

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

  return (
    <>
      <span className="inline-block text-3xl font-bold my-2">
        {UI_TEXT.CATEGORY.VIEW_ALL}
      </span>

      <div className="relative overflow-x-auto mt-5 bg-red-50 shadow-xs rounded-base border border-default">
        <div className="flex justify-end gap-2 my-2 mx-2">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search..."
            className="text-sm md:text-md h-10 px-4 py-2 rounded-md border border-black/30 focus:outline-none focus:ring-1 focus:ring-red-400 focus:shadow-md"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              setPage(APP_CONFIG.FIRST_PAGE);
            }}
          />

          <Link
            to={ROUTES.CATEGORY_ADD}
            className="bg-blue-200 p-2 rounded-md font-semibold text-sm"
          >
            {UI_TEXT.CATEGORY.ADD}
          </Link>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-red-100 border-b border-default-medium">
            <tr>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex flex-row gap-3 ">
                  {UI_TEXT.CATEGORY.ID}
                  {renderSortIcon('id')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex flex-row gap-3 ">
                  {UI_TEXT.CATEGORY.TABLE_NAME}
                  {renderSortIcon('name')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex flex-row gap-3">
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
            {!isLoading && error && (
              <tr>
                <td colSpan={4} className="font-semibold text-center p-2">
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
                      <Link
                        to={ROUTES.CATEGORY_EDIT(row.id)}
                        className="font-medium text-fg-brand hover:underline"
                      >
                        {UI_TEXT.PRODUCT.EDIT}
                      </Link>
                      <button
                        className="font-medium text-red-600 hover:underline hover:cursor-pointer"
                        onClick={() => {
                          setIsDeleting(row.id)
                          setShowDeleteModal(true)
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
        {isLoading == false && error == null && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            numberOfRows={numberOfRows}
            totalItems={totalItems}
            setPage={setPage}
          />
        )}
      </div>

      <ReusableModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setIsDeleting(null)
          return
        }}
      >
        <div className='w-full flex flex-col my-5 gap-4 items-center'>
          <span className='text-2xl font-semibold'>
            Are You Sure You Want To Delete?
          </span>

          <div className='w-full flex my-2 justify-center gap-2'>
            <button
              onClick={() => {
                if (isDeleting) deleteHandler(isDeleting)
                  
                setIsDeleting(null)
                setShowDeleteModal(false)
              }}
              className='w-fit bg-red-600 text-white px-3 py-2 rounded-lg hover:cursor-pointer hover:opacity-70'>
              Delete
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(false)
                setIsDeleting(null)
                return
              }}
              className='w-fit bg-blue-600 text-white px-3 py-2 rounded-lg hover:cursor-pointer hover:opacity-70'>
              Cancel
            </button>
          </div>
        </div>
      </ReusableModal>
    </>
  );
};

export default CategoryHomePage;
