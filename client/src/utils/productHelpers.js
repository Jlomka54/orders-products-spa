const hasFormValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const normalizeOrderValue = (value) => {
  if (!hasFormValue(value)) {
    return "";
  }

  return Number.isNaN(Number(value)) ? value : Number(value);
};

const formatDateInputValue = (value) => {
  if (!hasFormValue(value)) {
    return "";
  }

  if (typeof value === "string") {
    const dateOnlyMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);

    if (dateOnlyMatch) {
      return dateOnlyMatch[1];
    }
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const findPriceValue = (prices, symbol) => {
  if (!Array.isArray(prices)) {
    return "";
  }

  return prices.find((price) => price?.symbol === symbol)?.value ?? "";
};

export const getProductId = (product) => {
  if (!product) {
    return null;
  }

  return product._id ?? product.id ?? product.legacyId ?? null;
};

export const getProductRequestId = (product) => {
  if (!product) {
    return null;
  }

  return product._id ?? product.id ?? product.legacyId ?? null;
};

export const isSameProduct = (firstId, secondId) => {
  if (
    firstId === null ||
    firstId === undefined ||
    secondId === null ||
    secondId === undefined
  ) {
    return false;
  }

  return String(firstId) === String(secondId);
};

export const normalizeProduct = (product) => ({
  ...(product ?? {}),
  clientId: String(getProductId(product)),
});

export const createEmptyProductForm = () => ({
  legacyId: "",
  serialNumber: "",
  isNew: false,
  title: "",
  type: "",
  specification: "",
  guaranteeStart: "",
  guaranteeEnd: "",
  priceUsd: "",
  priceUah: "",
  order: "",
  date: "",
});

export const createProductFormFromProduct = (product) => ({
  ...createEmptyProductForm(),
  legacyId: product?.legacyId ?? "",
  serialNumber: product?.serialNumber ?? "",
  isNew: product?.isNew ?? false,
  title: product?.title ?? "",
  type: product?.type ?? "",
  specification: product?.specification ?? "",
  guaranteeStart: formatDateInputValue(product?.guarantee?.start),
  guaranteeEnd: formatDateInputValue(product?.guarantee?.end),
  priceUsd: findPriceValue(product?.price, "USD"),
  priceUah: findPriceValue(product?.price, "UAH"),
  order:
    product?.order === null || product?.order === undefined
      ? ""
      : String(product.order),
  date: formatDateInputValue(product?.date),
});

export const buildProductPayload = (form) => {
  const payload = {
    serialNumber: Number(form.serialNumber),
    isNew: Boolean(form.isNew),
    title: form.title,
    type: form.type,
    specification: form.specification,
    guarantee: {
      start: form.guaranteeStart,
      end: form.guaranteeEnd,
    },
    price: [
      { value: Number(form.priceUsd), symbol: "USD", isDefault: false },
      { value: Number(form.priceUah), symbol: "UAH", isDefault: true },
    ],
    order: normalizeOrderValue(form.order),
    date: form.date,
  };

  if (hasFormValue(form.legacyId)) {
    payload.legacyId = Number(form.legacyId);
  }

  return payload;
};
