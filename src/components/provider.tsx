import { ApiProvider } from "@/context/api";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

function Provider({ children }: { children: ReactNode }) {
  return (
    <ApiProvider>
      <ToastContainer position="top-right" autoClose={4000} theme="dark" />
      {children}
    </ApiProvider>
  );
}

export default Provider;
