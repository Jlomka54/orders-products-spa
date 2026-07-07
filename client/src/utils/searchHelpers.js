export const normalizeSearchText = (value) =>
  value === null || value === undefined
    ? ""
    : String(value).trim().toLowerCase();

export const matchesSearchQuery = (fields, query) => {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery || !Array.isArray(fields)) {
    return false;
  }

  return fields.some((field) =>
    normalizeSearchText(field).includes(normalizedQuery),
  );
};

export const getSafeEntityId = (entity) =>
  entity?._id ?? entity?.id ?? entity?.orderId ?? null;
