const toValidDate = (date) => {
  if (date === null || date === undefined || date === "") {
    return null;
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const formatShortDate = (date) => {
  const parsedDate = toValidDate(date);

  if (!parsedDate) {
    return "";
  }

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

  return `${day} / ${month}`;
};

export const formatLongDate = (date) => {
  const parsedDate = toValidDate(date);

  if (!parsedDate) {
    return "";
  }

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = parsedDate
    .toLocaleString("en-US", { month: "short" })
    .replace(".", "");
  const year = parsedDate.getFullYear();

  return `${day} / ${month} / ${year}`;
};
