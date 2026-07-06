import httpClient from "./httpClient";

export const getProductsApi = async (params) => {
  const response = await httpClient.get("/products", { params });

  return response.data;
};

export const getProductByIdApi = async (productId) => {
  const response = await httpClient.get(`/products/${productId}`);

  return response.data;
};

export const createProductApi = async (productData) => {
  const response = await httpClient.post("/products", productData);

  return response.data;
};

export const updateProductApi = async (productId, productData) => {
  const response = await httpClient.put(`/products/${productId}`, productData);

  return response.data;
};

export const deleteProductApi = async (productId) => {
  const response = await httpClient.delete(`/products/${productId}`);

  return response.data;
};
