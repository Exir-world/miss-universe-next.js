import { createStore, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosInstance, AxiosError } from "axios";

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
  joinGame: () => Promise<void>;
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
          console.log("Login data:", loginData);

          let phoneNumber = normalizePhoneNumber(loginData.phoneNumber);
          if (phoneNumber === null) {
            console.log("Invalid phone number");
            return false;
          }

          phoneNumber = countryCode + phoneNumber;
          console.log("Phone number:", phoneNumber);

          try {
            const res = await api.post("/mainuser/register", {
              nickname: "",
              phoneNumber,
              email: loginData.email,
              ...(referralCode !== "" ? { referralCode } : {}),
            });

            console.log("Login response:", { data: res.data, status: res.status });

            if (res.status === 201) {
              console.log("Login successful:", res.data);
              set({ 
                accessToken: res.data.token,
                isAuth: true 
              });
              return true;
            } else {
              console.log("Login failed:", res.data?.message?.[0] || "server error");
              return false;
            }
          } catch (err: unknown) {
            if ((err as AxiosError).isAxiosError) {
              console.log("Login error:", (err as AxiosError).message);
            } else {
              console.log("Login error:", err);
            }
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

              console.log("User data:", userData);

              const room = data.data?.mystery?.room;
              const mysteryContent = data.data?.mystery?.mysteryContent;

              console.log({ room, mysteryContent });

              // Call joinGame after successful getMe
              const { joinGame } = get();
              await joinGame();
            } else {
              console.log("User not authenticated");
              set({ isAuth: false });
            }
          } catch (err: unknown) {
            if ((err as AxiosError).isAxiosError) {
              console.log("getMe error:", (err as AxiosError).message);
            } else {
              console.log("getMe error:", err);
            }
            set({ isAuth: false });
          }
        },

        joinGame: async () => {
          try {
            // Get referral code from URL if available
            const urlParams = new URLSearchParams(window.location.search);
            const referralCode = urlParams.get('r');

            await api.post("/mainuser/join", {
              ...(referralCode ? { referralCode } : {}),
            });
          } catch (err: unknown) {
            if ((err as AxiosError).isAxiosError) {
              console.log("joinGame error:", (err as AxiosError).message);
            } else {
              console.log("joinGame error:", err);
            }
          }
        },
      }),
      {
        name: "login-storage",
        partialize: (state) => ({
          accessToken: state.accessToken,
          loginData: state.loginData,
          userData: state.userData,
          isAuth: state.isAuth,
        }),
      }
    )
  );
}
