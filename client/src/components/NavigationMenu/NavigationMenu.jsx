import { NavLink } from "react-router-dom";
import "./NavigationMenu.css";

const getNavLinkClassName = ({ isActive }) =>
  `navigation-menu__link${isActive ? " navigation-menu__link--active" : ""}`;

const NavigationMenu = () => {
  return (
    <aside className="navigation-menu">
      <div className="navigation-menu__profile">
        <div className="navigation-menu__avatar" aria-hidden="true" />
        <button
          className="navigation-menu__settings"
          type="button"
          aria-label="Settings"
        >
          ⚙
        </button>
      </div>

      <nav className="navigation-menu__nav" aria-label="Main navigation">
        <NavLink className={getNavLinkClassName} to="/orders">
          ПРИХОД
        </NavLink>
        <span className="navigation-menu__link navigation-menu__link--static">
          ГРУППЫ
        </span>
        <NavLink className={getNavLinkClassName} to="/products">
          ПРОДУКТЫ
        </NavLink>
        <span className="navigation-menu__link navigation-menu__link--static">
          ПОЛЬЗОВАТЕЛИ
        </span>
        <span className="navigation-menu__link navigation-menu__link--static">
          НАСТРОЙКИ
        </span>
      </nav>
    </aside>
  );
};

export default NavigationMenu;
