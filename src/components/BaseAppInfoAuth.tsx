import { FaChartLine, FaUsers } from 'react-icons/fa';
import { LuShoppingCart } from 'react-icons/lu';
import AppInfoCard, { type AppInfoCardProp } from './common/AppInfoCard';
import HeroBackgroundCircle from './common/HeroBackgroundCircle';
import { UI_TEXT } from '../utils/constants/constants';

const AppInfoCardData: AppInfoCardProp[] = [
  {
    Icon: <FaChartLine size={25} color={'white'} />,
    Title: UI_TEXT.APP_INFO.ANALYTICS_TITLE,
    Description: UI_TEXT.APP_INFO.ANALYTICS_DESCRIPTION,
    BackgroundColorClass: 'bg-red-700',
  },
  {
    Icon: <LuShoppingCart size={25} color={'white'} />,
    Title: UI_TEXT.APP_INFO.INVENTORY_TITLE,
    Description: UI_TEXT.APP_INFO.INVENTORY_DESCRIPTION,
    BackgroundColorClass: 'bg-gray-500',
  },
  {
    Icon: <FaUsers size={25} color={'white'} />,
    Title: UI_TEXT.APP_INFO.CUSTOMER_INSIGHTS_TITLE,
    Description: UI_TEXT.APP_INFO.CUSTOMER_INSIGHTS_DESCRIPTION,
    BackgroundColorClass: 'bg-gray-500',
  },
];

const BaseAppInfoAuth = () => {
  return (
    <div className="hidden relative isolate flex-1 h-full p-4 md:flex flex-col justify-center items-center">
      <HeroBackgroundCircle positionClass={'left-15 top-5'} width={300} height={300} />
      <HeroBackgroundCircle positionClass={'left-15 bottom-0'} width={250} height={200} />
      <HeroBackgroundCircle positionClass={'right-35 top-55'} width={150} height={150} />
      <HeroBackgroundCircle positionClass={'right-5 bottom-10'} width={250} height={200} />

      <div className="w-full relative z-10 max-w-5xl mx-auto flex flex-col gap-3">
        <div className="w-full flex flex-col items-center gap-3">
          <div className="flex items-center p-3 rounded-lg border-7 bg-red-800 border-red-200 animate-bounce">
            <LuShoppingCart className="shrink-0" size={35} color={'white'} />
          </div>
          <span className="font-bold text-lg md:text-4xl">
            {UI_TEXT.APP_INFO.ADMIN}{' '}
            <span className="text-red-800">{UI_TEXT.APP_INFO.COMMERCE}</span>
          </span>
        </div>
        <div className="w-1/2 text-center text-sm mx-auto">{UI_TEXT.APP_INFO.DESCRIPTION}</div>
        <div className="w-[75%] flex flex-col gap-3 mx-auto mt-4 mb-2">
          {AppInfoCardData.map((AppInfo, idx) => (
            <AppInfoCard
              key={idx}
              Icon={AppInfo.Icon}
              Title={AppInfo.Title}
              BackgroundColorClass={AppInfo.BackgroundColorClass}
              Description={AppInfo.Description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaseAppInfoAuth;
