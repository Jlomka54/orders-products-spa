import { NavLink } from "react-router-dom";

const NavigationMenu = () => {
  return (
    <div>
      <NavLink to="/orders">Приход</NavLink>
      <NavLink to="/products">Продукты</NavLink>
    </div>
  );
};

export default NavigationMenu;
