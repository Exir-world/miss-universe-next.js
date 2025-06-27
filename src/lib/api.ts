import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookie } from "cookies-next";
// Create an Axios instance
const token = process.env.NEXT_PUBLIC_API_TOKEN || "";

const gameName = getCookie("tenant") || "Dubaieid";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "", // Set your API base URL in .env
  timeout: 10000, // 10 seconds timeout
  headers: {
    Authorization: token,
    "Content-Type": "application/json",
    "x-game": gameName,
    // "Accept-Language": locale,
    // "x-lang": locale,
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth tokens or other headers here
    // Example: config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle global errors here (e.g., unauthorized, network errors)
    // Example: if (error.response?.status === 401) { ... }
    return Promise.reject(error);
  }
);

// Helper functions
export const get = <T = any>(url: string, config?: AxiosRequestConfig) =>
  api.get<T>(url, config).then((res) => res);

export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => api.post<T>(url, data, config).then((res) => res);

export default api;
