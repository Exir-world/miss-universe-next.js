"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useApi } from "@/context/api";

interface UserProfileProps {
  nickName?: string;
  id?: string;
}

export default function Avatar({ nickName, id }: UserProfileProps) {
  const t = useTranslations();
  const { photoUrl, firstname } = useApi();

  return (
    <div className="w-full flex items-center gap-4">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="avatar"
          className="w-[72px] h-[72px] rounded-full object-cover"
        />
      ) : (
        <div className="w-[72px] h-[72px] bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-2xl font-bold">
            {(nickName || firstname || "U").charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex flex-col">
        <p className="font-medium text-white">
          Hey {nickName || firstname || "User"}
        </p>
        <p className="text-white">{id}</p>
      </div>
    </div>
  );
}
