import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import Script from "next/script";
import PageWrapper from "@/components/PageWrapper";
import { getCurrentTenant } from "@/lib/tenant";
import Provider from "@/components/provider";

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
  const tenant = (await getCurrentTenant()) || "Dubaieid";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        ></Script>
      </head>
      <body>
        <NextIntlClientProvider locale={locale}>
          <Provider>
            <PageWrapper>{children}</PageWrapper>
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
