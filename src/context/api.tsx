// context/ApiProvider.tsx (updated)
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
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

export function ApiProvider({ children }: { children: React.ReactNode }) {
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

    // Use the actual initData from WebApp
    const initData = WebApp.initData;

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

    if (initData) {
      const { photoUrl: parsedPhotoUrl, firstname: parsedFirstname } = parseInitData(initData);
      setPhotoUrl(parsedPhotoUrl);
      setFirstname(parsedFirstname);
    }

    // Create API instance
    const axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://api.cicada1919.ex.pro",
      headers: {
        ...(initData ? { Authorization: initData } : {}),
        "Content-Type": "application/json",
        "x-game": process.env.NEXT_PUBLIC_GAME_NAME || "Dubaieid",
        "Accept-Language": locale,
        "x-lang": locale,
      },
    });

    // Add response interceptor
    axiosInstance.interceptors.response.use(
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

    setApiInstance(axiosInstance);
    const store = createLoginStore(axiosInstance);
    setLoginStore(store);
  }, [locale]);

  if (!apiInstance || !loginStore) {
    return null;
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
