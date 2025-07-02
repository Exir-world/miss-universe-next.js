import axios, { AxiosInstance } from "axios";

let globalInitData: string | undefined;

export function setInitData(data: string) {
  globalInitData = data;
}

export function getInitData() {
  return globalInitData;
}

// This function creates a configured Axios instance
export function createAxiosInstance(locale: string, initData?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "",
    headers: {
      ...((initData || globalInitData) ? { Authorization: initData || globalInitData } : {}),
      "Content-Type": "application/json",
      "x-game": process.env.NEXT_PUBLIC_GAME_NAME || "Dubaieid",
      "Accept-Language": locale,
      "x-lang": locale,
    },
  });

  // Add response interceptor
  instance.interceptors.response.use(
    (res) => res,
    (err: unknown) => {
      if (axios.isAxiosError(err)) {
        console.error("API Error:", {
          url: err?.config?.url,
          status: err?.response?.status,
          message: err?.response?.data?.message || "API error",
        });
      } else {
        console.error("API Error:", err);
      }
      return Promise.reject(err);
    }
  );

  return instance;
} 