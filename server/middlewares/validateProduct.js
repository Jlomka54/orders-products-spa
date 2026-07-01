const requiredProductFields = [
  "serialNumber",
  "photo",
  "title",
  "type",
  "specification",
  "guarantee",
  "price",
  "order",
  "date",
];

const isMissing = (value) => value === undefined || value === null || value === "";

const toBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === 1 || value === "1" || value === "true") {
    return true;
  }

  if (value === 0 || value === "0" || value === "false") {
    return false;
  }

  return value;
};

const normalizeProductPayload = (body) => {
  const payload = { ...body };

  if (payload.id !== undefined && payload.legacyId === undefined) {
    payload.legacyId = payload.id;
    delete payload.id;
  }

  if (payload.isNew !== undefined) {
    payload.isNew = toBoolean(payload.isNew);
  }

  if (Array.isArray(payload.price)) {
    payload.price = payload.price.map((price) => ({
      ...price,
      isDefault: toBoolean(price?.isDefault),
    }));
  }

  return payload;
};

const hasValidDate = (value) => !Number.isNaN(Date.parse(value));

export const validateProduct = (req, res, next) => {
  const payload = normalizeProductPayload(req.body ?? {});
  const missingFields = requiredProductFields.filter((field) => isMissing(payload[field]));

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Required product fields are missing",
      fields: missingFields,
    });
  }

  if (
    !payload.guarantee ||
    isMissing(payload.guarantee.start) ||
    isMissing(payload.guarantee.end)
  ) {
    return res.status(400).json({
      message: "Guarantee start and end dates are required",
    });
  }

  if (
    !hasValidDate(payload.date) ||
    !hasValidDate(payload.guarantee.start) ||
    !hasValidDate(payload.guarantee.end)
  ) {
    return res.status(400).json({
      message: "Product date and guarantee dates must be valid dates",
    });
  }

  if (!Array.isArray(payload.price) || payload.price.length === 0) {
    return res.status(400).json({
      message: "At least one price is required",
    });
  }

  const hasInvalidPrice = payload.price.some(
    (price) =>
      isMissing(price?.value) ||
      Number.isNaN(Number(price.value)) ||
      Number(price.value) < 0 ||
      isMissing(price?.symbol),
  );

  if (hasInvalidPrice) {
    return res.status(400).json({
      message: "Each price must include a non-negative value and currency symbol",
    });
  }

  req.body = payload;
  next();
};

export const normalizeProductUpdate = (req, _res, next) => {
  req.body = normalizeProductPayload(req.body ?? {});
  next();
};
