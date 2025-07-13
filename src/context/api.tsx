// context/ApiProvider.tsx (updated)
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import WebApp from "@twa-dev/sdk";
import { useLocale } from "next-intl";
import { createLoginStore } from "@/stores/login";
import { AppStoreProvider } from "@/stores/context";
import { createAxiosInstance, setInitData } from "@/lib/axiosInstance";
import { AxiosInstance } from "axios";

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

  // const initData =
  //   "query_id=AAE-nkBjAwAAAD6eQGMScSUG&user=%7B%22id%22%3A8107630142%2C%22first_name%22%3A%22Exirgec%22%2C%22last_name%22%3A%22Matik%22%2C%22username%22%3A%22matik1999%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FAQDD4nj43TOOafYj3NKKxtdCLkQkjGNODLgeLJucGUv9U3559dQKbVUVt3Jwb0R-.svg%22%7D&auth_date=1751347874&signature=2FwAypWVjneJet8IL-_XkHIkyd7qor5hSvxyFw3fj2mqE9VTEESl68-wuCi8fBs6wfppWHVkH61bZeSQAitYBw&hash=482403cdef4ce142588435112f2bd33db7899ba81a741ec6e29ce6dc5b399e73";

  const initData = typeof window !== "undefined" ? WebApp?.initData : "";

  // Use the shared axios instance
  const apiInstance = useMemo(
    () => createAxiosInstance(locale, initData),
    [locale, initData]
  );

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

    if (initData) {
      setInitData(initData); // Set global initData for all axios instances
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
