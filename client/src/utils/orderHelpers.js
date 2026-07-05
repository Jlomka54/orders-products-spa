export const getOrderId = (order) => {
  if (!order) {
    return null;
  }

  return order.legacyId ?? order.id ?? order._id ?? null;
};

export const getOrderRequestId = (order) => getOrderId(order);

export const getOrderProducts = (order) => {
  if (Array.isArray(order?.products)) {
    return order.products;
  }

  if (Array.isArray(order?.items)) {
    return order.items;
  }

  return [];
};

export const getOrderDate = (order) => order?.date ?? order?.createdAt ?? null;

export const getProductsCount = (order) => {
  if (typeof order?.productsCount === "number" && Number.isFinite(order.productsCount)) {
    return order.productsCount;
  }

  return getOrderProducts(order).length;
};

export const isSameOrder = (firstId, secondId) => {
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

export const normalizeOrder = (order) => {
  const orderId = getOrderId(order);

  return {
    ...(order ?? {}),
    clientId: orderId === null ? null : String(orderId),
  };
};
