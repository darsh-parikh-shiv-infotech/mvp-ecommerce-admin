import Sidebar from './common/Sidebar';
import { initFlowbite } from 'flowbite';
import { useEffect } from 'react';
import Navbar from './common/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  useEffect(() => {
    initFlowbite();
  }, []);
  return (
    <div className='bg-red-100/50'>
      <Navbar />
      <Sidebar />

      <div className="min-h-dvh h-fit p-4 md:p-4 ml-0 md:ml-55 mt-16 md:mt-14">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
