import { Outlet } from 'react-router-dom';
import Navbar from './common/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
