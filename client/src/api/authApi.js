import httpClient from "./httpClient";

export const registerUserApi = async (data) => {
  const response = await httpClient.post("/auth/register", data);

  return response.data;
};

export const loginUserApi = async (data) => {
  const response = await httpClient.post("/auth/login", data);

  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await httpClient.get("/auth/me");

  return response.data;
};
