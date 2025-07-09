"use client";

import { FaUser, FaListUl, FaUserFriends } from "react-icons/fa";
import { IoGameControllerSharp } from "react-icons/io5";
import { Link, usePathname } from "@/i18n/navigation";
import { IoIosPersonAdd } from "react-icons/io";
import { useEffect, useState } from "react";

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
      label: "Friends",
      icon: <IoIosPersonAdd />,
    },
    {
      link: "/profile",
      label: "profile",
      icon: <FaUser />,
    },
  ];

  const pathname = usePathname();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  if (pathname.startsWith("/questions")) {
    return null;
  }
  useEffect(() => {
    const threshold = 150; // Minimum height difference to detect keyboard

    const handleResize = () => {
      const isOpen =
        window.innerHeight <
        (window.outerHeight || window.screen.height) - threshold;
      setIsKeyboardOpen(isOpen);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`${
        isKeyboardOpen ? "absolute" : "fixed"
      } bottom-4 left-4 right-4 z-30 h-20 flex items-center justify-evenly px-6 py-4 bg-black/80 text-white rounded-full transition-all duration-300`}
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
