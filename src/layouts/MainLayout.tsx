import Sidebar from './common/Sidebar';
import { initFlowbite } from 'flowbite';
import { useEffect } from 'react';
import Navbar from './common/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  useEffect(() => {
    initFlowbite()
  }, []);
  return (
    <>
      <Navbar/>
      <Sidebar/>
    
      <div className="h-dvh p-4 sm:ml-50 mt-14 bg-red-100/50">
        <Outlet/>
      </div>

    </>
  );
};

export default MainLayout;
