"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { IoMdShare } from "react-icons/io";
import { PiTelegramLogo } from "react-icons/pi";
import { IoCopyOutline } from "react-icons/io5";
import { useApi } from "@/context/api";
import { useLoginStoreState } from "@/stores/context";
import { FaEnvelopeOpenText } from "react-icons/fa";

export default function Referral() {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralUrl, setReferralUrl] = useState("");
  const t = useTranslations();
  const { api } = useApi();
  const { userData } = useLoginStoreState();
  const user = userData.user;
  const referralCode = userData.referral?.code ?? "";
  const config = { gameName: process.env.NEXT_PUBLIC_GAME_NAME || "Dubaieid" };

  const fullShareLink = `${referralUrl}${referralCode}`;
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
        setReferralUrl("https://cicada1919.ex.pro/");
        setFriends(response.data.data || []);
      } catch (err) {
        console.error("Error fetching referrals:", err);
        // If API fails, show empty state instead of crashing
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  const handleLinkCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareLink);
      toast.success("code copied to clipboard! 🎉");
    } catch {
      toast.error("Failed to copy code to clipboard. Please try again. ");
    }
  };

  const handleShareLink = () => {
    const imageLink = `https://token.ex.pro/cdn/logo/${config.gameName}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      fullShareLink
    )}&text=${encodeURIComponent(`${shareText}\n\n${imageLink}`)}`;
    window.open(telegramUrl, "_blank");
  };

  const handleLinkWithShareApi = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Join the airdrop",
          text: shareText,
          url: fullShareLink,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      handleShareLink();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl mb-2 h-[calc(100vh-11rem)] font-semibold text-white border border-[#C643A8E5] w-full bg-[#7D7D7D4D]/30 bg-opacity-80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6">
            <FaEnvelopeOpenText size={20} />
          </span>
          <p className="font-semibold text-sm">
            {/* {t("presidentjoker.presidentjoker-tasks.button")} */}Friends
          </p>
        </div>
        <p className="font-thin text-xs">
          ({friends.length}){" "}
          {/* {t("presidentjoker.presidentjoker-tasks.invite-des")} */}
        </p>
      </div>

      <ul className="overflow-auto h-full">
        {friends.length === 0 ? (
          <div className="flex flex-col items-center h-full w-full justify-center py-3">
            <p className="font-bold text-center">
              {/* {t("presidentjoker.presidentjoker-tasks.noinvited-friends")} */}
            </p>
          </div>
        ) : (
          friends.map((friend, index) => (
            <li key={index} className="mt-4">
              {index + 1}. {friend.nickname}
              <p className="font-thin text-xs">10000 EX9630</p>
            </li>
          ))
        )}
      </ul>

      <div className="flex items-center w-full gap-4 py-1 justify-end">
        {canShare && (
          <div className="flex items-center gap-2 w-full">
            <p className="p-2 border-[#C643A8E5] rounded-full border grow text-center truncate">
              {fullShareLink}
            </p>
            <button
              onClick={handleLinkWithShareApi}
              className="flex justify-center items-center size-10 border border-[#C643A8E5] rounded-full text-white"
            >
              <IoMdShare size={18} />
            </button>
          </div>
        )}

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
  );
}
