import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import Script from "next/script";
import PageWrapper from "@/components/PageWrapper";
import { getCurrentTenant } from "@/lib/tenant";
import Provider from "@/components/provider";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const tenant = (await getCurrentTenant()) || "Dubaieid";
  return {
    title: tenant,
    description: "Join the airdrop",
    icons: {
      icon: `/${tenant}/favicon.ico`,
    },
  };
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const dir = locale === "fa" ? "rtl" : "ltr";

  const fontUrls = {
    en: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    fr: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap",
    de: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
    ru: "https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap",
    es: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap",
    ar: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap",
    fa: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap",
    zh: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
    hi: "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap",
    id: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap", // Indonesian
    ja: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap", // Japanese
    ko: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap", // Korean
    ps: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap", // Pashto (using Roboto as a fallback)
    tr: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap", // Turkish
  };

  const fontFamilies: Record<string, string> = {
    en: '"Poppins", sans-serif',
    fr: '"Open Sans", sans-serif',
    de: '"Roboto", sans-serif',
    ru: '"PT Serif", serif',
    es: '"Montserrat", sans-serif',
    ar: '"Cairo", sans-serif',
    fa: '"Vazirmatn", sans-serif',
    zh: '"Noto Sans SC", sans-serif',
    hi: '"Roboto Condensed", sans-serif',
    id: '"Roboto", sans-serif',
    ja: '"Noto Sans JP", sans-serif',
    ko: '"Noto Sans KR", sans-serif',
    ps: '"Roboto", sans-serif',
    tr: '"Roboto", sans-serif',
  };

  const fontUrl = fontUrls[locale] || fontUrls.en;
  const fontFamily = fontFamilies[locale] || fontFamilies.en;

  const linkElement = (
    <link
      key="font-link"
      rel="stylesheet"
      href={fontUrl}
      crossOrigin="anonymous"
    />
  );

  return (
    <html lang={locale} dir={dir}>
      <head>
        {linkElement}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        ></Script>
      </head>
      <body style={{ fontFamily }}>
        <NextIntlClientProvider locale={locale}>
          <Provider>
            <PageWrapper>{children}</PageWrapper>
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
