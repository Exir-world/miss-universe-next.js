"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import BottomNavbar from "@/components/BottomNavbar";
import { toast } from "react-toastify";
import WebApp from "@twa-dev/sdk";

export default function HomePage() {
  const t = useTranslations();
  const [useData, setUserData] = useState({});

  useEffect(() => {
    WebApp.ready();
    
  }, []);

  const notify = () => toast.error("Wow so easy!");

  return (
    <div>
      <button onClick={notify}>Notify!</button>{" "}
      <BottomNavbar hasGameSecret></BottomNavbar>
    </div>
  );
}
