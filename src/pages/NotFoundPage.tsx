import { Link } from 'react-router-dom';
import { ROUTES, UI_TEXT } from '../utils/constants/constants';

const NotFoundPage = () => {
  return (
    <>
      <div className="w-full h-dvh overflow-hidden bg-red-100">
        <div className="h-full flex flex-col items-center gap-5 justify-center">
          <span className="text-4xl font-bold">{UI_TEXT.COMMON.PAGE_NOT_FOUND}</span>
          <Link to={ROUTES.HOME} className="bg-blue-200 p-2 rounded-md font-semibold text-sm">
            {UI_TEXT.COMMON.BACK_TO_HOME}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
