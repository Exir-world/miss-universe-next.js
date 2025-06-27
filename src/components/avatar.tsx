"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface UserProfileProps {
  photoUrl?: string;
  nickName?: string;
  id?: string;
}

export default function Avatar({ photoUrl, nickName, id }: UserProfileProps) {
  const t = useTranslations();

  return (
    <div className="w-full flex items-center gap-4">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="avatar"
          className="w-[72px] h-[72px] rounded-full object-cover"
        />
      ) : (
        <div className="w-[72px] h-[72px] bg-gray-300 rounded-full" />
      )}
      <div className="flex flex-col">
        <p className="font-medium text-white">
          {/* {t("hello")} {"nickName"} */}
        </p>
        <p className="text-white">{id}</p>
      </div>
    </div>
  );
}
