import { Link } from "react-router-dom";
import Sidebar from "../layouts/common/Sidebar";
import Navbar from "../layouts/common/Navbar";

const NotFoundPage = () => {
  return (
    <>
      <Sidebar />
      <Navbar/>
      <div className="w-full h-dvh overflow-hidden bg-red-100">
        <div className="h-full flex flex-col items-center gap-5 justify-center">
          <span className="text-4xl font-bold">Page Not Found</span>
          <Link to={"/"} className="bg-blue-200 p-2 rounded-md font-semibold text-sm">Back To Home</Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
