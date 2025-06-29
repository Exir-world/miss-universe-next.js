// context/ApiProvider.tsx (updated)
"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
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
  const [photoUrl, setPhotoUrl] = useState("");
  const [firstname, setFirstname] = useState("");
  const [loginStore, setLoginStore] = useState<ReturnType<
    typeof createLoginStore
  > | null>(null);

  const locale = useLocale();

  // Memoize the API instance to prevent unnecessary re-creation
  const apiInstance = useMemo(() => {
    const initData =
      "query_id=AAE-nkBjAwAAAD6eQGOAbph8&user=%7B%22id%22%3A8107630142%2C%22first_name%22%3A%22Exirgec%22%2C%22last_name%22%3A%22Matik%22%2C%22username%22%3A%22matik1999%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FAQDD4nj43TOOafYj3NKKxtdCLkQkjGNODLgeLJucGUv9U3559dQKbVUVt3Jwb0R-.svg%22%7D&auth_date=1751198553&signature=71ziCNFe16o4H3FTVx4gNA79cCJ_ZyL-rT0fP9RJydQQhF-E0je5MJ--I0YHVxyCAjSn_mZgyQsxUVm7mOs2Cg&hash=f496e0f18631e0daab33f97d4caed50985403a5ff80e448e7b53c308b162f9c0";

    const axiosInstance = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_BASE_URL || "",
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

    return axiosInstance;
  }, [locale]);

  useEffect(() => {
    WebApp.ready();

    const user = WebApp.initDataUnsafe?.user;
    setPhotoUrl(user?.photo_url || "");
    setFirstname(user?.first_name || "");

    const parseInitData = (data: string) => {
      const params = new URLSearchParams(data);
      const userJson = params.get("user");
      if (!userJson) {
        return { photoUrl: "", firstname: "" };
      }
      const userData = JSON.parse(userJson);
      return {
        photoUrl: userData.photo_url
          ? userData.photo_url.replace(/\\/g, "/")
          : "",
        firstname: userData.first_name,
      };
    };

    const initData =
      "query_id=AAE-nkBjAwAAAD6eQGOAbph8&user=%7B%22id%22%3A8107630142%2C%22first_name%22%3A%22Exirgec%22%2C%22last_name%22%3A%22Matik%22%2C%22username%22%3A%22matik1999%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FAQDD4nj43TOOafYj3NKKxtdCLkQkjGNODLgeLJucGUv9U3559dQKbVUVt3Jwb0R-.svg%22%7D&auth_date=1751198553&signature=71ziCNFe16o4H3FTVx4gNA79cCJ_ZyL-rT0fP9RJydQQhF-E0je5MJ--I0YHVxyCAjSn_mZgyQsxUVm7mOs2Cg&hash=f496e0f18631e0daab33f97d4caed50985403a5ff80e448e7b53c308b162f9c0";

    if (initData) {
      const { photoUrl: parsedPhotoUrl, firstname: parsedFirstname } =
        parseInitData(initData);
      setPhotoUrl(parsedPhotoUrl);
      setFirstname(parsedFirstname);
    }

    const store = createLoginStore(apiInstance);
    setLoginStore(store);
  }, [apiInstance]); // Only depend on apiInstance

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
      <AppStoreProvider loginStore={loginStore}>{children}</AppStoreProvider>
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
