"use client";
import { useLocale } from "next-intl";
import { useMemo } from "react";

const useDir = () => {
  const locale = useLocale();

  const dir = useMemo(() => {
    return locale === "fa" || locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return dir;
};

export default useDir;
