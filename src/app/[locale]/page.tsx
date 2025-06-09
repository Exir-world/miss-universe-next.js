"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import BottomNavbar from "@/components/BottomNavbar";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const [useData, setUserData] = useState({});
  
  useEffect(() => {
    // Dynamically import SDK after window is available
    import("@twa-dev/sdk").then((WebApp) => {
      WebApp.default.ready(); // optional
      const user = WebApp.default.initDataUnsafe?.user;
      if (user) setUserData(user);
    });
  }, []);

  console.log(useData);

  return (
    <div>
      <BottomNavbar hasGameSecret></BottomNavbar>
    </div>
  );
}
