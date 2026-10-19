import { logout } from '../../store/slices/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/hooks';
import HomeNavLogoButton from './HomeNavLogoButton';
import { ASSET_URLS, UI_TEXT } from '../../utils/constants/constants';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleSignOut = () => {
    dispatch(logout());
  };
  return (
    <nav className="fixed top-0 z-50 w-full bg-red-100 border-b border-default">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <button
              data-drawer-target="top-bar-sidebar"
              data-drawer-toggle="top-bar-sidebar"
              aria-controls="top-bar-sidebar"
              type="button"
              className="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-black/25 font-medium leading-5 rounded-base text-sm p-2 focus:outline-none inline-flex sm:hidden"
            >
              <span className="sr-only">{UI_TEXT.COMMON.OPEN_SIDEBAR}</span>
              <svg
                className="w-6 h-6"
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
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h10"
                />
              </svg>
            </button>
            <HomeNavLogoButton />
          </div>

          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">{UI_TEXT.COMMON.OPEN_USER_MENU}</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user?.profile_image || ASSET_URLS.DEFAULT_USER_AVATAR}
                    alt={UI_TEXT.COMMON.USER_PHOTO_ALT}
                  />
                </button>
              </div>
              <div
                className="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-fit"
                id="dropdown-user"
              >
                <div className="px-4 py-3 border-b border-default-medium" role="none">
                  <p className="text-sm font-medium text-heading" role="none">
                    {user?.full_name}
                  </p>
                  <p className="text-sm text-body truncate" role="none">
                    {user?.email}
                  </p>
                </div>
                <ul className="p-2 text-sm text-body font-medium" role="none">
                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                      role="menuitem"
                    >
                      {UI_TEXT.COMMON.SIGN_OUT}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
