import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const RootPage = async () => {
  const locale = await getLocale();

  redirect(`/${locale}`);
};

export default RootPage;
