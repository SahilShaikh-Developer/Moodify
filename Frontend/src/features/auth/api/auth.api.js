import axiosInstance from "../../../lib/axios";

export async function registerAPI(data) {
  const response = await axiosInstance.post("/auth/register", data);

  return response.data;
}
export async function loginAPI(data) {
  const response = await axiosInstance.post("/auth/login", data);

  return response.data;
}

export async function logOutAPI(data) {
  const response = await axiosInstance.post("/auth/logout", data);

  return response.data;
}

export async function getMeAPI() {
  const response = await axiosInstance.get("/auth/get-me");

  return response.data;
}

export async function googleAuthAPI(code) {
  const response = await axiosInstance.post("/auth/google", { code });

  return response.data;
}
