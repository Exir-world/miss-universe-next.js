"use client";

import React from "react";
import Image from "next/image";
import { useApi } from "@/context/api";
import { useTranslations } from "next-intl";

interface UserProfileProps {
  nickName?: string;
  id?: string;
}

export default function Avatar({ nickName, id }: UserProfileProps) {
  const { photoUrl, firstname } = useApi();
  const t = useTranslations();

  return (
    <div className="w-full flex items-center gap-4">
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt="avatar"
          width={72}
          height={72}
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
          {t('common.hey')} {nickName || firstname || t('common.user')}
        </p>
        <p className="text-white">{id}</p>
      </div>
    </div>
  );
}
