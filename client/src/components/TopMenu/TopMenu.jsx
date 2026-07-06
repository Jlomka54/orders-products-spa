import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import "./TopMenu.css";

const formatWeekday = (date) =>
  date.toLocaleDateString("ru-RU", { weekday: "long" });

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date) =>
  date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

const TopMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeSessions = useSelector((state) => state.ui.activeSessions);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="top-menu">
      <div className="top-menu__brand">
        <span className="top-menu__logo" aria-hidden="true" />
        <span className="top-menu__brand-text">ИНВЕНТАРЬ</span>
      </div>

      <label className="top-menu__search">
        <span className="top-menu__search-label">Поиск</span>
        <input className="top-menu__search-input" type="search" />
      </label>

      <ul className="top-menu__meta">
        <li className="top-menu__weekday">{formatWeekday(currentDate)}</li>
        <li className="top-menu__date">{formatDate(currentDate)}</li>
        <li className="top-menu__time">{formatTime(currentDate)}</li>
        <li className="top-menu__logout-item">
          <button
            className="top-menu__logout"
            type="button"
            onClick={handleLogout}
          >
            Выход
          </button>
        </li>
        <li className="top-menu__sessions">Сессий: {activeSessions}</li>
      </ul>
    </header>
  );
};

export default TopMenu;
