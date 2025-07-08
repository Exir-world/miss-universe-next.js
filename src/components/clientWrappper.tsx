"use client";
import { useEffect } from "react";
import { useLoginStoreState } from "@/stores/context";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getMe } = useLoginStoreState();

  useEffect(() => {
    const callMe = async () => {
      await getMe();
    };
    callMe();
    // Optionally, add dependencies if you want to re-run on certain changes
  }, []);

  return <>{children}</>;
}
