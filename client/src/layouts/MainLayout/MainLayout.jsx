import { Outlet } from "react-router-dom";
import NavigationMenu from "../../components/NavigationMenu/NavigationMenu";
import TopMenu from "../../components/TopMenu/TopMenu";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <TopMenu />
      <div className="main-layout__body">
        <NavigationMenu />
        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
