const requiredOrderFields = ["title", "date"];

const isMissing = (value) => value === undefined || value === null || value === "";

const normalizeOrderPayload = (body) => {
  const payload = { ...body };

  if (payload.id !== undefined && payload.legacyId === undefined) {
    payload.legacyId = payload.id;
  }

  delete payload.id;

  return payload;
};

const hasValidDate = (value) => !Number.isNaN(Date.parse(value));

export const validateOrder = (req, res, next) => {
  const payload = normalizeOrderPayload(req.body ?? {});
  const missingFields = requiredOrderFields.filter((field) => isMissing(payload[field]));

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Required order fields are missing",
      fields: missingFields,
    });
  }

  if (!hasValidDate(payload.date)) {
    return res.status(400).json({
      message: "Order date must be a valid date",
    });
  }

  req.body = payload;
  next();
};

export const normalizeOrderUpdate = (req, _res, next) => {
  req.body = normalizeOrderPayload(req.body ?? {});
  next();
};
