"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { GrLanguage } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

const availableLocales = [
  { code: "ar", name: "العربية", icon: "sa" },
  { code: "de", name: "Deutsch", icon: "de" },
  { code: "en", name: "English", icon: "gb" },
  { code: "es", name: "Español", icon: "es" },
  { code: "fr", name: "Français", icon: "fr" },
  { code: "hi", name: "हिन्दी", icon: "in" },
  { code: "id", name: "Bahasa Indonesia", icon: "id" },
  { code: "ja", name: "日本語", icon: "jp" },
  { code: "ko", name: "한국어", icon: "kr" },
  { code: "ps", name: "پښتو", icon: "af" },
  { code: "ru", name: "Русский", icon: "ru" },
  { code: "tr", name: "Türkçe", icon: "tr" },
  { code: "zh", name: "中文", icon: "cn" },
  { code: "fa", name: "فارسی", icon: "fa" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const filteredLocales = availableLocales.filter((i) => i.code !== locale);

  const switchLocale = (code: string) => {
    router.push(`/${code}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <GrLanguage className="w-6 h-6 " />
        <span className="font-medium ">{locale.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#242424]  rounded-xl shadow-xl p-6 w-80 max-h-[80vh] overflow-y-auto z-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="p-1 w-full flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full  text-red-500 font-medium hover:text-red-600 transition-colors duration-200"
                >
                  <IoMdClose size={24}></IoMdClose>
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                {/* Select Language */}
              </h3>
              <div className="grid gap-2 ">
                {filteredLocales.map((l) => (
                  <button
                    key={l.code}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-white"
                    onClick={() => switchLocale(l.code)}
                  >
                    <span
                      className={`fi fi-${l.icon} fis`}
                      style={{ width: 24, height: 24 }}
                    ></span>
                    <span className="font-medium text-white">{l.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
