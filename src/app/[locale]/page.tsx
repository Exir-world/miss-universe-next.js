"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import BottomNavbar from "@/components/BottomNavbar";
import WebApp from "@twa-dev/sdk";
import { useLoginStore, useLoginStoreState } from "@/stores/context";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";

export default function HomePage() {
  const t = useTranslations();
  const [useData, setUserData] = useState({});
  const { hasGameSecret } = useLoginStoreState();
  const router = useRouter();
  const loginStore = useLoginStore();

  const [secretToken, setSecretToken] = useState<string | null>(null);
  const [notRegisteredModal, setNotRegisteredModal] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [data, setData] = useState<{ logo: string }>({ logo: "" });

  useEffect(() => {
    const mystery =
      loginStore.getInitialState().userData.mystery?.mysteryContent;
    if (mystery) {
      setSecretToken(mystery);
    }

    if (loginStore.userData?.isWinner) {
      setIsWinner(true);
    }
  }, [loginStore.userData]);

  useEffect(() => {
    WebApp.ready();
  }, []);

  const copyToClipboard = async () => {
    if (!secretToken) return;
    try {
      await navigator.clipboard.writeText(secretToken);
      toast.success(t("presidentjoker.presidentjoker-success.code"));
    } catch (err) {
      toast.error(t("presidentjoker.presidentjoker-wrong.button"));
    }
  };

  const handleGoToInfo = () => {
    const hasPId = !!loginStore.userData?.user?.pid;
    if (!hasPId) {
      setNotRegisteredModal(true);
    } else {
      const url = `https://token.ex.pro/en/salon?mystery=${secretToken}`;
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(url);
      } else {
        window.open(url, "_blank");
      }
    }
  };

  const goToGame = () => {
    router.push("/questions");
  };
  
  const gameName = process.env.NEXT_PUBLIC_GAME_NAME || "Dubaieid";

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen pb-10 pt-2 text-white text-center">
        {/* Not Registered Modal */}
        {notRegisteredModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-black border border-primary rounded-lg p-6 relative max-w-sm w-full">
              <button
                onClick={() => setNotRegisteredModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <div className="mb-4">
                <svg
                  className="h-16 w-16 text-yellow-400 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium mb-6">
                {/* {t("presidentjoker.presidentjoker-auth.notRegistered")} */}
              </p>
              <button
                onClick={() => router.push("/Profile")}
                className="w-full bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary-dark"
              >
                {/* {t("presidentjoker.presidentjoker-auth.button")} */}
              </button>
            </div>
          </div>
        )}

        {/* Logo + Interactions */}
        <Image
          src={`${gameName}/${gameName}.svg`}
          width={220}
          height={220}
          alt="Logo"
          // className={`w-2/3 max-w-72 cursor-pointer ${
          //   loginStore.userData?.isWinner ? "animate-spin-slow" : ""
          // }`}
          onClick={goToGame}
        />

        {secretToken ? (
          <>
            <span className="text-green-400 text-2xl font-bold mt-2">
              {/* {t("presidentjoker.presidentjoker-success.title")} */}
            </span>
            <p className="mt-4">
              {/* {t("presidentjoker.presidentjoker-success.des")} */}
            </p>

            <div className="flex p-4 mt-6 bg-white/20 border border-primary rounded-lg backdrop-blur-sm w-full max-w-md justify-between items-center">
              <span className="truncate">{secretToken}</span>
              <button onClick={copyToClipboard}>📋</button>
            </div>

            <button
              onClick={handleGoToInfo}
              className="w-full max-w-md mt-4 border-2 border-primary rounded-full py-2 text-white"
            >
              {/* {t("presidentjoker.presidentjoker-success.button")} */}
            </button>
          </>
        ) : (
          <button className="text-primary font-bold text-3xl mt-6">
            {/* {t("presidentjoker.presidentjoker-Home.click")} */}
          </button>
        )}

        {/* Winner Modal */}
        {isWinner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-black border border-green-400 p-6 rounded-lg text-center max-w-sm w-full">
              <div className="mb-4">
                <span className="text-yellow-400 text-4xl">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                🎉 {t("presidentjoker.presidentjoker-success.title")}!
              </h2>
              <p className="text-lg text-white mb-4">
                {/* {t("presidentjoker.presidentjoker-success.winnerDes")} */}
              </p>
              <button
                onClick={() => router.push("/profile")}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mb-2"
              >
                {/* 🎁 {t("presidentjoker.presidentjoker-success.claimButton")} */}
              </button>
              <button
                onClick={() => router.push("/tasks")}
                className="w-full text-sm text-gray-300 hover:text-white"
              >
                {/* {t("presidentjoker.presidentjoker-success.exploreButton")} → */}
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNavbar hasGameSecret={hasGameSecret}></BottomNavbar>
    </div>
  );
}
