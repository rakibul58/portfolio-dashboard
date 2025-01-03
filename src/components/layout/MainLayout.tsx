import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const MainLayout = () => {
  const { pathname } = useLocation();

  //to scroll to top every time route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="w-full max-w-7xl min-h-screen mx-auto px-4 lg:px-0">
      <Outlet />
    </div>
  );
};

export default MainLayout;
