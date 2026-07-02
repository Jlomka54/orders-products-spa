import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./TopMenu.css";

const formatWeekday = (date) =>
  date.toLocaleDateString("en-US", { weekday: "long" });

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const TopMenu = () => {
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

  return (
    <header className="top-menu">
      <div className="top-menu__brand">
        <span className="top-menu__logo" aria-hidden="true" />
        <span className="top-menu__brand-text">INVENTORY</span>
      </div>

      <label className="top-menu__search">
        <span className="top-menu__search-label">Поиск</span>
        <input className="top-menu__search-input" type="search" />
      </label>

      <ul className="top-menu__meta">
        <li className="top-menu__weekday">{formatWeekday(currentDate)}</li>
        <li className="top-menu__date">{formatDate(currentDate)}</li>
        <li className="top-menu__time">{formatTime(currentDate)}</li>
        <li className="top-menu__sessions">Sessions: {activeSessions}</li>
      </ul>
    </header>
  );
};

export default TopMenu;
