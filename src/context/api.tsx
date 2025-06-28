"use client";
import axios from "axios";
import { useLocale } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import WebApp from "@twa-dev/sdk";

interface ApiContextType {
  api: any;
  photoUrl: string;
  firstname: string;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: any) {
  const [api, setApi] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [firstname, setFirstname] = useState("");

  const locale = useLocale();

  useEffect(() => {
    
    WebApp.ready();
    // const initData = WebApp.initData;
    const initData = `query_id=AAGYalJLAgAAAJhqUkv4tT_T&user=%7B%22id%22%3A5558659736%2C%22first_name%22%3A%22Hossein%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22about_hs99%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FSV2v4HB2SdXTlKLXg0HQqDoQ13fZmSKyH_kFuH7RnnhPRVzGjtL6BUZW8Do2BJd0.svg%22%7D&auth_date=1742299813&signature=u0nWaL3RXjTnIZu1crlx20XKZid_8kJ0k4UPmX0BuhJCN3q7K2tfboppfM3xlJop_G5UGBvaBRR4O8UDWy8mBQ&hash=d9922e2e409b7d4a98b70c9b0490d4e70add5274c7d372bd25c3827ae1d1b490`;

    const user = WebApp.initDataUnsafe?.user;

    const photo = user?.photo_url || "";
    const first = user?.first_name || "";

    setPhotoUrl(photo);
    setFirstname(first);

    if (!initData) {
      toast.error("Missing Telegram initData. Please open in Telegram WebApp.");
      return;
    }

    const axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        Authorization: initData,
        "Content-Type": "application/json",
        "x-game": process.env.NEXT_PUBLIC_GAME_NAME,
        "Accept-Language": locale,
        "x-lang": locale,
      },
    });

    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const errorMessage =
            error.response.data.message || "An error occurred";
          toast.error(errorMessage);
        } else {
          toast.error("Network error. Please try again.");
        }
        return Promise.reject(error);
      }
    );

    setApi(axiosInstance);
  }, []);

  return (
    <ApiContext.Provider value={{ api, photoUrl, firstname }}>
      {children}
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
