"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FaLanguage } from "react-icons/fa";

const availableLocales = [
  { code: "en", name: "English", icon: "gb" },
  { code: "fa", name: "فارسی", icon: "ir" },
  { code: "de", name: "Deutsch", icon: "de" },
  // بقیه زبان‌ها
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const filteredLocales = availableLocales.filter((i) => i.code !== locale);

  const switchLocale = (code: string) => {
    router.push(`/${code}`);
    setIsOpen(false);
  };

  return (
    <div>
      <div
        className="flex items-center relative p-2 cursor-pointer gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaLanguage className="w-6 h-6" />
        <span className="flex">{locale.toUpperCase()}</span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-4 grid gap-4 w-64">
            {filteredLocales.map((l) => (
              <button
                key={l.code}
                className="flex items-center gap-2 font-semibold text-lg justify-center"
                onClick={() => switchLocale(l.code)}
              >
                <span
                  className={`fi fi-${l.icon} fis`}
                  style={{ width: 24, height: 24 }}
                ></span>
                {l.name}
              </button>
            ))}
            <button
              onClick={() => setIsOpen(false)}
              className="text-red-500 text-center mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
