import { LuShoppingCart } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { ROUTES, UI_TEXT } from '../../utils/constants/constants';

const HomeNavLogoButton = () => {
  return (
    <Link to={ROUTES.HOME}>
      <div className="w-full flex flex-row items-center gap-3">
        <div className="flex items-center px-2 py-2 rounded-base bg-red-700">
          <LuShoppingCart className="shrink-0" size={15} color={'white'} />
        </div>
        <span className="font-bold text-lg">{UI_TEXT.COMMON.ADMIN_SHOP}</span>
      </div>
    </Link>
  );
};

export default HomeNavLogoButton;
