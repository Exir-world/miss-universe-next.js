import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    "en",
    "fa",
    "ar",
    "de",
    "es",
    "fr",
    "hi",
    "id",
    "ja",
    "ko",
    "ps",
    "ru",
    "tr",
    "zh",
  ],

  // Used when no locale matches
  defaultLocale: "en",
});
