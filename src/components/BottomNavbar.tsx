"use client";

import { FaUser, FaListUl, FaUserFriends } from "react-icons/fa";
import { IoGameControllerSharp } from "react-icons/io5";
import { Link, usePathname } from "@/i18n/navigation";

export default function BottomNavbar({
  hasGameSecret,
}: {
  hasGameSecret?: boolean;
}) {
  const pages = [
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
  ];
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 h-20 flex items-center justify-evenly px-6 py-4 bg-black/80 text-white rounded-full  transition-all duration-300">
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
