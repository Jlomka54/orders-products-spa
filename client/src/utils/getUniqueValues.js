export const getUniqueValues = (items, key) => {
  if (!Array.isArray(items) || !key) {
    return [];
  }

  const values = items
    .map((item) => item?.[key])
    .filter((value) =>
      typeof value === "string"
        ? value.trim() !== ""
        : value !== null && value !== undefined,
    );

  return Array.from(
    new Set(values),
  );
};
