import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import {
  clearSearchQuery,
  closeSearch,
  openSearch,
  setSearchQuery,
} from "../../features/ui/uiSlice";
import { selectSearchQuery } from "../../features/ui/uiSelectors";
import SearchDropdown from "./SearchDropdown";
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
  const searchQuery = useSelector(selectSearchQuery);
  const searchRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleDocumentMouseDown = (event) => {
      if (searchRef.current?.contains(event.target)) {
        return;
      }

      dispatch(closeSearch());
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== "") {
      dispatch(openSearch());
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dispatch(clearSearchQuery());
    }
  };

  const handleClearSearch = () => {
    dispatch(clearSearchQuery());
  };

  return (
    <header className="top-menu">
      <div className="top-menu__brand">
        <span className="top-menu__logo" aria-hidden="true" />
        <span className="top-menu__brand-text">ИНВЕНТАРЬ</span>
      </div>

      <div className="top-menu__search" ref={searchRef}>
        <span className="top-menu__search-label">Поиск</span>
        <input
          className="top-menu__search-input"
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onKeyDown={handleSearchKeyDown}
        />
        {searchQuery && (
          <button
            className="top-menu__search-clear"
            type="button"
            aria-label="Clear search"
            onClick={handleClearSearch}
          >
            ×
          </button>
        )}
        <SearchDropdown />
      </div>

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
