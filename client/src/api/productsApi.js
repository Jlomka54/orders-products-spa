import httpClient from "./httpClient";

export const getProductsApi = async (params) => {
  const response = await httpClient.get("/products", { params });

  return response.data;
};

export const getProductByIdApi = async (productId) => {
  const response = await httpClient.get(`/products/${productId}`);

  return response.data;
};
