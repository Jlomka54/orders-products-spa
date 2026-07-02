const getPriceValue = (price) => {
  if (price?.value === null || price?.value === undefined || price?.value === "") {
    return 0;
  }

  const numericValue = Number(price?.value);

  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const calculateOrderTotal = (products, currencySymbol) => {
  if (!Array.isArray(products) || !currencySymbol) {
    return 0;
  }

  return products.reduce((total, product) => {
    const selectedPrice = product?.price?.find(
      (price) => price?.symbol === currencySymbol,
    );

    return total + getPriceValue(selectedPrice);
  }, 0);
};
