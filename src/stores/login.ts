import { StateCreator, createStore, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosInstance } from "axios";

interface User {
  id: number;
  userTgId: string;
  email: string;
  phoneNumber: string;
  nickname: string;
  pid: number;
}

interface Referral {
  id: number;
  userId: number;
  code: string;
  game: string;
}

interface Mystery {
  id: number;
  mysteryContent: string;
  room: string | null;
  session: string | null;
  game: string;
  userId: number;
  createdAt: string;
}

interface DataStructure {
  user: User;
  referral?: Referral;
  mystery?: Mystery;
  isWinner: boolean | null;
}

interface LoginData {
  nickname: string;
  phoneNumber: string;
  email: string;
}

interface LoginStore {
  loginData: LoginData;
  userData: DataStructure;
  isAuth: boolean;
  accessToken: string;
  hasGameSecret: boolean;
  setLoginData: (data: Partial<LoginData>) => void;
  login: (countryCode?: string, referralCode?: string) => Promise<boolean>;
  getMe: () => Promise<void>;
  normalizePhoneNumber: (input: string) => string | null;
}

export type { LoginStore };

export function createLoginStore(api: AxiosInstance): StoreApi<LoginStore> {
  return createStore<LoginStore>()(
    persist(
      (set, get) => ({
        loginData: { nickname: "", phoneNumber: "", email: "" },
        userData: {
          user: {
            id: 0,
            userTgId: "",
            email: "",
            phoneNumber: "",
            nickname: "",
            pid: 0,
          },
          isWinner: null,
        },
        isAuth: false,
        accessToken: "",
        hasGameSecret: false,

        setLoginData: (data) => {
          set((state) => ({
            loginData: {
              ...state.loginData,
              ...data,
            },
          }));
        },

        normalizePhoneNumber: (input: string) => {
          const regex =
            /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;
          const match = input.match(regex);
          return match ? input : null;
        },

        login: async (countryCode = "", referralCode = "") => {
          const { loginData, normalizePhoneNumber } = get();
          const phone = normalizePhoneNumber(loginData.phoneNumber);

          if (!phone) {
            console.log("Invalid phone number");
            return false;
          }

          const fullPhone = countryCode + phone;

          try {
            const res = await api.post("/mainuser/register", {
              nickname: "",
              phoneNumber: fullPhone,
              email: loginData.email,
              ...(referralCode ? { referralCode } : {}),
            });

            const data = res.data;

            if (res.status === 201) {
              set({ accessToken: data.token });
              return true;
            } else {
              console.log(data?.message?.[0] || "server error");
              return false;
            }
          } catch (err) {
            console.error("Login error", err);
            return false;
          }
        },

        getMe: async () => {
          try {
            const res = await api.get("/mainuser/me");

            const data = res.data;

            if (res.status === 200) {
              const userData: DataStructure = data.data;
              const hasSecret = !!userData.mystery?.mysteryContent;

              set({
                userData,
                isAuth: true,
                hasGameSecret: hasSecret,
              });
            } else {
              console.log("User not authenticated");
            }
          } catch (err) {
            console.error(err);
          }
        },
      }),
      {
        name: "login-storage",
        partialize: (state) => ({
          accessToken: state.accessToken,
          loginData: state.loginData,
          userData: state.userData,
        }),
      }
    )
  );
}
