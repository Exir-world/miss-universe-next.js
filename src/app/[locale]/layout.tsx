import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import Script from "next/script";
import PageWrapper from "@/components/PageWrapper";
import useDir from "@/hooks/useDir";

export const metadata = {
  title: "Dubaieid",
  description: "Join the airdrop",
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

  return (
    <html lang={locale} dir={dir}>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        ></Script>
      </head>
      <body>
        <NextIntlClientProvider>
          <PageWrapper>{children}</PageWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
