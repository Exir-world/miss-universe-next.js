import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const RootPage = async () => {
  const locale = getLocale();

  redirect(`/${locale}`);
};

export default RootPage;
