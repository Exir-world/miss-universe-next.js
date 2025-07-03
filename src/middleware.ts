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
  // const hostname = request.headers.get("host") || "";
  // const tenant = domains[hostname];

  const response = NextResponse.next();
  // if (tenant) {
  //   response.cookies.set("tenant", tenant);
  // }

  const locale = await getLocale();
  const pathname = request.nextUrl.pathname;
  const hasGameSecret = request.cookies.get("hasGameSecret").value;
  
  if (!hasGameSecret) {
    // Prevent infinite loop: don't redirect if already on /[locale]/intro
    if (pathname.startsWith(`/${locale}/intro`)) {
      return response;
    }
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/${locale}/intro`);
  }

  return response;
}

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
