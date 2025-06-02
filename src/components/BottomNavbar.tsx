"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaUser, FaListUl, FaUserFriends } from "react-icons/fa";
import { IoGameControllerSharp } from "react-icons/io5";

const BackButton = dynamic(() => import("./BackButton"), { ssr: false });

export default function BottomNavbar({
  hasGameSecret,
}: {
  hasGameSecret: boolean;
}) {
  const t = useTranslations("");
  const pathname = usePathname();
  const router = useRouter();

  const pages = useMemo(
    () => [
      {
        link: "/",
        label: "game",
        icon: <IoGameControllerSharp />,
      },
      {
        link: "/tasks",
        label: "tasks",
        icon: <FaListUl />,
      },
      {
        link: "/referral",
        label: "referral",
        icon: <FaUserFriends />,
      },
      {
        link: "/profile",
        label: "profile",
        icon: <FaUser />,
      },
    ],
    [t]
  );

  const availablePages = useMemo(() => {
    return pages.filter((p) => {
      if (hasGameSecret) return p.link !== "/lottery"; // Keep Game, remove lottery
      return p.link !== "/"; // Remove Game if no gameSecret
    });
  }, [pages, hasGameSecret]);

  const showNavbar = useMemo(() => {
    const routeName = pathname?.toLowerCase();
    return [
      "/intro/start",
      "/intro/play",
      "/",
      "/tasks",
      "/referral",
      "/profile",
    ].includes(routeName);
  }, [pathname]);

  const handleBack = () => {
    if (pathname === "/questions") {
      router.push("/profile");
    } else if (pathname?.startsWith("/questions/")) {
      router.push("/questions");
    } else {
      router.back();
    }
  };

  return (
    <>
      {
        <div className="fixed bottom-4 left-4 right-4 z-30 h-20 flex items-center justify-evenly px-6 py-4 bg-black/40 text-white rounded-full backdrop-blur-sm transition-all duration-300">
          {availablePages.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className={`flex flex-col items-center gap-1  ${
                pathname === item.link ? "text-blue-400" : ""
              }`}
            >
              <div className="size-6 flex justify-center">{item.icon}</div>
              <div className="text-sm capitalize">{item.label}</div>
            </Link>
          ))}
        </div>
      }
    </>
  );
}
