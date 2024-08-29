import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppRoute = ({ children }) => {
  return (
    <div className="">
      <div className="min-h-screen md:grid md:grid-cols-12">
        <div className="lg:col-span-2 dark:bg-slate-900 hidden md:block">
          <Sidebar />
        </div>
        <div className="md:col-span-10  dark:bg-slate-500 p-2 h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppRoute;
