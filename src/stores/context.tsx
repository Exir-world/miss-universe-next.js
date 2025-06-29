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
  const state = loginStore.getState();
  
  return {
    // State
    loginData: state.loginData,
    userData: state.userData,
    isAuth: state.isAuth,
    accessToken: state.accessToken,
    hasGameSecret: state.hasGameSecret,
    // Actions
    setLoginData: state.setLoginData,
    login: state.login,
    getMe: state.getMe,
    joinGame: state.joinGame,
    normalizePhoneNumber: state.normalizePhoneNumber,
  };
}
