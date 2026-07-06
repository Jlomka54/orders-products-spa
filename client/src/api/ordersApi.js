import httpClient from "./httpClient";
import { getOrderId } from "../utils/orderHelpers";

export const getOrdersApi = async () => {
  const response = await httpClient.get("/orders");

  return response.data;
};

export const getOrderByIdApi = async (orderId) => {
  const response = await httpClient.get(`/orders/${orderId}`);

  return response.data;
};

export const createOrderApi = async (orderData) => {
  const response = await httpClient.post("/orders", orderData);

  return response.data;
};

export const updateOrderApi = async (orderId, orderData) => {
  const response = await httpClient.put(`/orders/${orderId}`, orderData);

  return response.data;
};

export const deleteOrderApi = async (orderId) => {
  const response = await httpClient.delete(`/orders/${orderId}`);

  return response.data;
};

export const getOrdersWithDetailsApi = async () => {
  const orders = await getOrdersApi();

  if (!Array.isArray(orders)) {
    return [];
  }

  return Promise.all(
    orders.map(async (order) => {
      const orderId = getOrderId(order);

      if (orderId === null || orderId === undefined) {
        return order;
      }

      try {
        return await getOrderByIdApi(orderId);
      } catch {
        return order;
      }
    }),
  );
};
