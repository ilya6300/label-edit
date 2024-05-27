import axios from "axios";
import Memory from "../store/Memory";

export const request = axios.create({
  baseURL: "http://10.76.10.37:8033/api/v1/",
});
request.interceptors.request.use((config) => {
  Memory.exchangeFlag(true);
  return config;
});
request.interceptors.response.use((config) => {
  Memory.exchangeFlag(false);
  return config;
});
