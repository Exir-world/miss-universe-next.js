// stores/context.ts
"use client";

import { createContext, useContext, ReactNode } from "react";
import { StoreApi } from "zustand";
import { LoginStore } from "@/stores/login";

type AppStore = {
  loginStore: StoreApi<LoginStore>;
};

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ 
  children, 
  loginStore 
}: { 
  children: ReactNode;
  loginStore: StoreApi<LoginStore>;
}) {
  return (
    <AppStoreContext.Provider value={{ loginStore }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return store;
}

export function useLoginStore() {
  const { loginStore } = useAppStore();
  return loginStore;
}

// Convenience hook that provides direct access to store state and actions
export function useLoginStoreState() {
  const loginStore = useLoginStore();
  return {
    // State
    loginData: loginStore.getState().loginData,
    userData: loginStore.getState().userData,
    isAuth: loginStore.getState().isAuth,
    accessToken: loginStore.getState().accessToken,
    hasGameSecret: loginStore.getState().hasGameSecret,
    // Actions
    setLoginData: loginStore.getState().setLoginData,
    login: loginStore.getState().login,
    getMe: loginStore.getState().getMe,
    normalizePhoneNumber: loginStore.getState().normalizePhoneNumber,
  };
}
