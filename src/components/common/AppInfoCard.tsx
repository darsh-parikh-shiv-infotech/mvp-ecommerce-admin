import type { ReactNode } from 'react';

export interface AppInfoCardProp {
  Icon: ReactNode;
  Title: string;
  Description: string;
  BackgroundColorClass: string;
}

const AppInfoCard = ({ Icon, Title, Description, BackgroundColorClass }: AppInfoCardProp) => {
  return (
    <div className="flex flex-row gap-2 items-center opacity-75 p-4 rounded-lg bg-white transform transition-all hover:scale-105 duration-300 ease-in-out">
      <div className={`flex items-center px-2 py-2 rounded-base ${BackgroundColorClass}`}>
        <div className="shrink-0">{Icon}</div>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-md"> {Title} </span>
        <span className="text-sm"> {Description} </span>
      </div>
    </div>
  );
};

export default AppInfoCard;
