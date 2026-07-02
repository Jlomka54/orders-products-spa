import httpClient from "./httpClient";

export const getOrdersApi = async () => {
  const response = await httpClient.get("/orders");

  return response.data;
};

export const getOrderByIdApi = async (orderId) => {
  const response = await httpClient.get(`/orders/${orderId}`);

  return response.data;
};

export const deleteOrderApi = async (orderId) => {
  const response = await httpClient.delete(`/orders/${orderId}`);

  return response.data;
};
