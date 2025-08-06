"use client";

import { FaUser, FaListUl } from "react-icons/fa";
import { IoGameControllerSharp } from "react-icons/io5";
import { Link, usePathname } from "@/i18n/navigation";
import { IoIosPersonAdd } from "react-icons/io";
import { useTranslations } from "next-intl";

export default function BottomNavbar({
  hasGameSecret,
}: {
  hasGameSecret?: boolean;
}) {
  const t = useTranslations();
  const pages = [
    {
      link: "/",
      label: t("global.game"),
      icon: <IoGameControllerSharp />,
    },
    {
      link: "/tasks",
      label: t("global.tasks"),
      icon: <FaListUl />,
    },
    {
      link: "/referral",
      label: t("global.friends"),
      icon: <IoIosPersonAdd />,
    },
    {
      link: "/profile",
      label: t("global.profile"),
      icon: <FaUser />,
    },
  ];

  const pathname = usePathname();

  if (pathname.startsWith("/questions") || pathname.startsWith("/intro")) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-30 h-20 flex items-center justify-evenly px-6 py-4 bg-black/80 text-white rounded-full transition-all duration-300`}
    >
      {pages.map((item) => (
        <Link
          key={item.link}
          href={item.link}
          className={`flex flex-col items-center gap-1 ${
            pathname === item.link ? "text-pink-400" : "text-white"
          } `}
        >
          <div className="size-6 flex justify-center">{item.icon}</div>
          <div className="text-sm capitalize">{item.label}</div>
        </Link>
      ))}
    </div>
  );
}
