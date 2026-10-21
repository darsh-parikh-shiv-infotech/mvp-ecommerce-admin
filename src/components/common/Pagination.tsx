import { APP_CONFIG, UI_TEXT } from '../../utils/constants/constants';

interface PaginationProp {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  numberOfRows: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  numberOfRows,
  totalItems,
  onPageChange,
}: PaginationProp) => {
  const firstItem = totalItems === 0 || numberOfRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = firstItem === 0 ? 0 : Math.min(firstItem + numberOfRows - 1, totalItems);
  const startPage = Math.max(
    APP_CONFIG.FIRST_PAGE,
    currentPage - APP_CONFIG.PAGE_RANGE_BEFORE_CURRENT,
  );
  const endPage = Math.min(currentPage + APP_CONFIG.PAGE_RANGE_AFTER_CURRENT, totalPages);
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index,
  );

  return (
    <nav
      className="flex items-center flex-column flex-wrap md:flex-row md:justify-between p-4"
      aria-label={UI_TEXT.COMMON.TABLE_NAVIGATION}
    >
      <span className="text-2xs md:text-sm font-normal text-body mb-4 md:mb-0 block w-full md:inline md:w-auto">
        {UI_TEXT.COMMON.SHOWING}{' '}
        <span className="font-semibold text-heading">
          {firstItem}
          {UI_TEXT.COMMON.RANGE_SEPARATOR}
          {lastItem}
        </span>{' '}
        {UI_TEXT.COMMON.OF} <span className="font-semibold text-heading">{totalItems}</span>
      </span>
      <ul className="flex justify-between -space-x-px text-2xs md:text-sm">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(Math.max(APP_CONFIG.FIRST_PAGE, currentPage - 1))}
            disabled={currentPage <= APP_CONFIG.FIRST_PAGE}
            className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-base text-2xs md:text-sm px-3 h-9 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {UI_TEXT.COMMON.PREVIOUS}
          </button>
        </li>
        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`flex items-center justify-center box-border border border-default-medium font-medium text-2xs md:text-sm px-3 h-9 ${currentPage === page ? 'bg-red-100 text-heading' : 'text-body bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium hover:text-heading'}`}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-base text-2xs md:text-sm px-3 h-9 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {UI_TEXT.COMMON.NEXT}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
