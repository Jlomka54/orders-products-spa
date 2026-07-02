import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
    <ul>
      <li>{formatWeekday(currentDate)}</li>
      <li>{formatDate(currentDate)}</li>
      <li>{formatTime(currentDate)}</li>
      <li>Sessions: {activeSessions}</li>
    </ul>
  );
};

export default TopMenu;
