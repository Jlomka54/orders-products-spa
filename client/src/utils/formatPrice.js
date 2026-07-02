const toValidNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

export const formatPrice = (value, symbol = "") => {
  const numericValue = toValidNumber(value);

  if (numericValue === null) {
    return "";
  }

  const formattedValue = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(numericValue) ? 0 : 2,
  }).format(numericValue);

  return [formattedValue, symbol].filter(Boolean).join(" ");
};

export const formatProductPrices = (priceArray) => {
  if (!Array.isArray(priceArray)) {
    return "";
  }

  return [...priceArray]
    .sort((firstPrice, secondPrice) =>
      Number(Boolean(secondPrice?.isDefault)) -
      Number(Boolean(firstPrice?.isDefault)),
    )
    .map((price) => formatPrice(price?.value, price?.symbol))
    .filter(Boolean)
    .join(" / ");
};
