// context/ApiProvider.tsx (updated)
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import axios, { AxiosInstance } from "axios";
import WebApp from "@twa-dev/sdk";
import { useLocale } from "next-intl";
import { createLoginStore } from "@/stores/login";
import { AppStoreProvider } from "@/stores/context";

interface ApiContextType {
  api: AxiosInstance;
  photoUrl: string;
  firstname: string;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: any) {
  const [apiInstance, setApiInstance] = useState<AxiosInstance | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [firstname, setFirstname] = useState("");
  const [loginStore, setLoginStore] = useState<ReturnType<typeof createLoginStore> | null>(null);

  const locale = useLocale();

  useEffect(() => {
    WebApp.ready();

    const user = WebApp.initDataUnsafe?.user;
    setPhotoUrl(user?.photo_url || "");
    setFirstname(user?.first_name || "");

    // const initData = WebApp.initData;
    const initData =
      "query_id=AAE-nkBjAwAAAD6eQGMDcqZR&user=%7B%22id%22%3A8107630142%2C%22first_name%22%3A%22Exirgec%22%2C%22last_name%22%3A%22Matik%22%2C%22username%22%3A%22matik1999%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FAQDD4nj43TOOafYj3NKKxtdCLkQkjGNODLgeLJucGUv9U3559dQKbVUVt3Jwb0R-.svg%22%7D&auth_date=1751092686&signature=QVDirkjxHhiHNllPthIxlKNPY8HzTRPTW2J1g4-uKWssbbWoGDd157oK1p8gNLLP4MlQrlfuGnxQRb4zL4TTBA&hash=a342b85c7c08f27e3884afe458ebbfc815f72073698aae12d08a191302d571fc";

    const parseInitData = (data: string) => {
      const params = new URLSearchParams(data);
      const userJson = params.get('user');
      if (!userJson) {
      return { photoUrl: '', firstname: '' };
      }
      const userData = JSON.parse(userJson);
      return {
      photoUrl: userData.photo_url
        ? userData.photo_url.replace(/\\/g, '/')
        : '',
      firstname: userData.first_name,
      };
    };

    const { photoUrl: parsedPhotoUrl, firstname: parsedFirstname } = parseInitData(initData);
    setPhotoUrl(parsedPhotoUrl);
    setFirstname(parsedFirstname);

    if (!initData) return;

    const axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://api.cicada1919.ex.pro",
      headers: {
        Authorization: initData,
        "Content-Type": "application/json",
        "x-game": process.env.NEXT_PUBLIC_GAME_NAME || "Dubaieid",
        "Accept-Language": locale,
        "x-lang": locale,
      },
    });

    axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        const message = err?.response?.data?.message || "API error";
        
        // Log detailed error information for debugging
        console.error("API Error:", {
          url: err?.config?.url,
          status: err?.response?.status,
          message: message,
          baseURL: err?.config?.baseURL,
          method: err?.config?.method,
        });

        // Don't throw errors for 404s, just log them
        if (err?.response?.status === 404) {
          console.warn("API endpoint not found:", err?.config?.url);
          return Promise.reject(err);
        }

        // For other errors, still reject but with better logging
        return Promise.reject(err);
      }
    );

    setApiInstance(axiosInstance);
    const store = createLoginStore(axiosInstance);
    setLoginStore(store);
  }, []);

  if (!apiInstance || !loginStore) {
    return null; // or loading indicator
  }

  return (
    <ApiContext.Provider
      value={{
        api: apiInstance,
        photoUrl,
        firstname,
      }}
    >
      <AppStoreProvider loginStore={loginStore}>
        {children}
      </AppStoreProvider>
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
