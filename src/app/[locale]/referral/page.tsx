"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { IoMdShare } from "react-icons/io";
import { PiTelegramLogo } from "react-icons/pi";
import { IoCopyOutline } from "react-icons/io5";
import { useApi } from "@/context/api";
import { useLoginStoreState } from "@/stores/context";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { useTranslations } from "next-intl";

export type Referral = {
  id: number;
  userTgId: string;
  pid: number | null;
  email: string | null;
  phoneNumber: string | null;
  nickname: string | null;
  referralCode: string;
};

interface Friend {
  id: number;
  type: string; // or use a union of known types
  createdAt: string; // ISO date string
  referral: Referral;
}

export default function Referral() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { api } = useApi();
  const { userData } = useLoginStoreState();
  const referralCode = userData?.user?.referralCode || "";
  console.log(referralCode, "referral");

  const config = { gameName: process.env.NEXT_PUBLIC_GAME_NAME || "Dubaieid" };
  const t = useTranslations();
  // Build the referral link robustly

  const getReferralUrl = () => {
    const base =
      process.env.NEXT_REFERRAL_URL ||
      (typeof window !== "undefined" ? window.location.origin + "/?r=" : "");
    return `${base}${referralCode}`;
  };
  const referralUrl = getReferralUrl();
  const fullShareLink = referralUrl;
  const canShare = typeof window !== "undefined" && !!navigator?.share;

  const shareText = useMemo(
    () =>
      `💥 Don't miss this exclusive airdrop! 🎁 
Join now and claim your share of free tokens before it's too late! 🚀 
Click the link and start earning with me today! 
🔗✨ https://cicada1919.ex.pro`,
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/mainuser/referrals");

        setFriends(response.data.data || []);
      } catch (err) {
        console.error("Error fetching referrals:", err);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  const handleLinkCopy = async () => {
    const linkToCopy = getReferralUrl();
    try {
      await navigator.clipboard.writeText(linkToCopy);
      toast.success(t("home.successCode"));
    } catch {
      toast.error(t("home.wrongCode"));
    }
  };

  const handleShareLink = () => {
    const imageLink = `https://token.ex.pro/cdn/logo/${config.gameName}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      getReferralUrl()
    )}&text=${encodeURIComponent(`${shareText}\n\n${imageLink}`)}`;
    window.open(telegramUrl, "_blank");
  };

  const handleLinkWithShareApi = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Join the airdrop",
          text: shareText,
          url: getReferralUrl(),
        })
        .then(() => console.log("Shared successfully"))
        .catch((error: unknown) => console.error("Error sharing:", error));
    } else {
      handleShareLink();
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-4 rounded-2xl mb-2 h-[calc(100vh-11rem)] font-semibold text-white border border-[#C643A8E5] w-full bg-[#7D7D7D4D]/30 bg-opacity-80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6">
            <FaEnvelopeOpenText size={20} />
          </span>
          <p className="font-semibold text-sm">{t("referral.friends")}</p>
          <p className="font-thin text-xs">({friends.length})</p>
        </div>
      </div>

      <ul className="overflow-auto h-full">
        {friends.length === 0 ? (
          <div className="flex flex-col items-center h-full w-full justify-center py-3">
            <p className="font-bold text-center"></p>
          </div>
        ) : (
          friends.map((friend: Friend, index: number) => (
            <li key={index} className="mt-4">
              {index + 1}. {friend.referral.nickname}
              <p className="font-thin text-xs">10000 EX9630</p>
            </li>
          ))
        )}
      </ul>

      <div className="grid grid-cols-2 gap-4 py-1 w-full">
        <div className="flex items-center w-full">
          {
            <p className="p-2 border-[#C643A8E5] rounded-full border w-full text-center truncate text-sm">
              {fullShareLink}
            </p>
          }
        </div>
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            onClick={handleLinkWithShareApi}
            className="flex justify-center items-center size-10 border border-[#C643A8E5] rounded-full text-white"
          >
            <IoMdShare size={18} />
          </button>
          <button
            style={{ aspectRatio: "1 / 1" }}
            onClick={handleShareLink}
            className="flex justify-center items-center size-10 border border-[#C643A8E5] rounded-full text-white"
          >
            <PiTelegramLogo size={18} />
          </button>
          <button
            onClick={handleLinkCopy}
            className="flex justify-center items-center w-10 h-10 border border-[#C643A8E5] rounded-full text-white"
            style={{ aspectRatio: "1 / 1" }}
          >
            <IoCopyOutline size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
