import { Outlet } from "react-router-dom";
import NavigationMenu from "../../components/NavigationMenu/NavigationMenu";
import TopMenu from "../../components/TopMenu/TopMenu";

const MainLayout = () => {
  return (
    <div>
      <TopMenu />
      <NavigationMenu />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
