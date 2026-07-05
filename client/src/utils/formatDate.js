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

  return parsedDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatLongDate = (date) => {
  const parsedDate = toValidDate(date);

  if (!parsedDate) {
    return "";
  }

  return parsedDate.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
