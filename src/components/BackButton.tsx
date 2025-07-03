"use client";

import { useTranslations } from "next-intl";

export default function BackButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations();
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-white text-black p-2 rounded-full shadow-md z-30"
    >
      ← {t("global.Back")}
    </button>
  );
}
