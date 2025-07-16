import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getLocale } from "next-intl/server";

const domains: Record<string, string> = {
  "https://t.me/atossa_expro_bot?start=": "atossa",
  "https://t.me/santamessenger_ex_pro_bot?start=": "santamessenger",
  "https://t.me/molanaeros_expro_bot?start=": "molanaeros",
  "https://t.me/tesla_expro_bot?start=": "tesla",
  "https://t.me/churchill_expro_bot?start=": "churchill",
  "https://t.me/satoshi_expro_bot?start=": "satoshi",
  "https://t.me/dubaieid_ex_pro_bot?start=": "dubaieid",
};

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // بررسی اینکه آیا pathname با یکی از locale‌ها شروع می‌شود
  const hasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // اگر locale در URL وجود نداشته باشد
  if (!hasLocale) {
    const locale = (await getLocale()) || routing.defaultLocale;
    const newUrl = new URL(`/${locale}${pathname}${search}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  const response = NextResponse.next();

  const locale = (await getLocale()) || routing.defaultLocale;
  const hasGameSecret = request.cookies.get("hasGameSecret")?.value || "";

  // اگر hasGameSecret وجود نداشته باشد
  // if (!hasGameSecret) {
  //   // جلوگیری از لوپ بی‌نهایت: اگر مسیر روی /[locale]/intro باشد، ادامه بده
  //   if (pathname.startsWith(`/${locale}/intro`)) {
  //     return response;
  //   }
  //   const origin = request.nextUrl.origin;
  //   return NextResponse.redirect(`${origin}/${locale}/intro`);
  // }

  return response;
}

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
