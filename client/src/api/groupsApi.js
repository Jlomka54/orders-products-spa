import httpClient from "./httpClient";

export const addProductToGroupApi = async (groupId, productId) => {
  const response = await httpClient.post(`/groups/${groupId}/products`, {
    productId,
  });

  return response.data;
};

export const removeProductFromGroupApi = async (groupId, productId) => {
  const response = await httpClient.delete(
    `/groups/${groupId}/products/${productId}`,
  );

  return response.data;
};
