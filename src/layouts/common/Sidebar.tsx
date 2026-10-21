import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../utils/hooks/hooks';
import { logout } from '../../store/slices/auth/authSlice';
import { ROUTES, UI_TEXT } from '../../utils/constants/constants';
import { clearStoredAuthToken } from '../../utils/common/authStorage';

const NavLinks: { text: string; linkPath: string; logo: ReactNode }[] = [
  {
    text: UI_TEXT.PRODUCT.PRODUCTS,
    linkPath: ROUTES.PRODUCT,
    logo: (
      <svg
        className="shrink-0 w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
        />
      </svg>
    ),
  },
  {
    text: UI_TEXT.CATEGORY.CATEGORIES,
    linkPath: ROUTES.CATEGORY,
    logo: (
      <svg
        className="shrink-0 w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
        />
      </svg>
    ),
  },
];
const Sidebar = () => {
  const dispatch = useAppDispatch();
  const handleSignOut = () => {
    clearStoredAuthToken();
    dispatch(logout());
  };
  return (
    <aside
      id="top-bar-sidebar"
      className="fixed top-12 left-0 z-40 w-55 sm:w-50 h-full transition-transform -translate-x-full sm:translate-x-0 bg-red-100"
      aria-label={UI_TEXT.COMMON.SIDEBAR}
    >
      <div className="h-[90%] flex flex-col justify-between px-3 py-4 overflow-y-auto border-e border-default">
        <ul className="space-y-2 font-medium">
          {NavLinks.map((navLink, index) => {
            return (
              <li key={index}>
                <NavLink linkPath={navLink.linkPath} text={navLink.text} logo={navLink.logo} />
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex gap-2 items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading hover:cursor-pointer rounded"
          role="menuitem"
        >
          <svg
            className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
            />
          </svg>
          {UI_TEXT.COMMON.SIGN_OUT}
        </button>
      </div>
    </aside>
  );
};

interface NavLinkProp {
  linkPath: string;
  text: string;
  logo: ReactNode;
}
const NavLink = ({ linkPath, text, logo }: NavLinkProp) => {
  return (
    <Link
      to={linkPath}
      className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary group"
    >
      {logo}
      <span className="ms-3">{text}</span>
    </Link>
  );
};
export default Sidebar;
