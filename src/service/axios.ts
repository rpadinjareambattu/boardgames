import axios, { AxiosInstance } from "axios";

export const createApiService = (): AxiosInstance => {
  let api;
  api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
    },
  });
  return api;
};
