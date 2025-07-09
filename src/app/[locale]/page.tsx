"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import BottomNavbar from "@/components/BottomNavbar";
import WebApp from "@twa-dev/sdk";
import { useLoginStoreState } from "@/stores/context";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { MdContentCopy } from "react-icons/md";

export default function HomePage() {
  const t = useTranslations();
  const { hasGameSecret, userData, getMe } = useLoginStoreState();
  const router = useRouter();

  const [secretToken, setSecretToken] = useState<string | null>(null);
  const [notRegisteredModal, setNotRegisteredModal] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    // (async () => {
    //   await getMe();
    // })();
    const mystery = userData.mystery?.mysteryContent;

    if (mystery) {
      setSecretToken(mystery);
    }

    if (userData.isWinner) {
      setIsWinner(true);
    }
  }, [userData]);

  useEffect(() => {
    WebApp.ready();
  }, []);

  const copyToClipboard = async () => {
    if (!secretToken) return;
    try {
      await navigator.clipboard.writeText(secretToken);
      toast.success(t("home.successCode"));
    } catch {
      toast.error(t("home.wrongCode"));
    }
  };

  const handleGoToInfo = () => {
    const hasPId = !!userData.user?.pid;
    if (!hasPId) {
      setNotRegisteredModal(true);
    } else {
      const url = `https://token.ex.pro/en/salon?mystery=${secretToken}`;
      if (
        (
          window as unknown as {
            Telegram?: { WebApp?: { openLink: (url: string) => void } };
          }
        ).Telegram?.WebApp
      ) {
        (
          window as unknown as {
            Telegram: { WebApp: { openLink: (url: string) => void } };
          }
        ).Telegram.WebApp.openLink(url);
      } else {
        window.open(url, "_blank");
      }
    }
  };

  const goToGame = () => {
    router.push("/questions");
  };

  

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen pb-10 pt-2 text-white text-center ">
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
                {t("auth.notRegistered")}
              </p>
              <button
                onClick={() => router.push("/profile")}
                className="w-full bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary-dark border "
              >
                {t("auth.button")}
              </button>
            </div>
          </div>
        )}

        {/* Logo + Interactions */}
        <Image
          src={`/${process.env.NEXT_PUBLIC_GAME_NAME}/${process.env.NEXT_PUBLIC_GAME_NAME}.svg`}
          width={220}
          height={220}
          alt="Logo"
          className={`w-2/3 max-w-72 cursor-pointer ${
            userData.isWinner ? "animate-spin-slow" : ""
          }`}
          onClick={goToGame}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/vercel.svg"; // fallback image
            console.warn('Logo image failed to load. Check NEXT_PUBLIC_GAME_NAME and file path.');
          }}
        />
        {(!process.env.NEXT_PUBLIC_GAME_NAME) && (
          <div className="text-red-500">Logo env variable missing!</div>
        )}
        {!secretToken && (
          <h3 className="text-[30px] font-bold bg-gradient-to-r from-[#F68E00] via-[#FFEA94] to-[#FFBD00] bg-clip-text text-transparent">
            {t("global.tapOnMe")}
          </h3>
        )}

        {secretToken ? (
          <>
            <span className="text-green-400 text-2xl font-bold mt-2">
              {t("home.success")}
            </span>
            <p className="mt-4">{t("home.des")}</p>

            <div className="flex p-2.5 mt-6 bg-white/20 border border-primary rounded-lg backdrop-blur-sm w-full max-w-md justify-between items-center">
              <span className="truncate">{secretToken}</span>
              <button onClick={copyToClipboard} className="p-1 " >
                <MdContentCopy size={24}/>
              </button>
            </div>

            <button
              onClick={handleGoToInfo}
              className="w-full max-w-md mt-4 border-2 border-[#FF4ED3] rounded-full py-3 text-white"
            >
              {t("home.button")}
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
                {t("home.title")}
              </h2>
              <p className="text-lg text-white mb-4">{t("home.winnerDes")}</p>
              <button
                onClick={() => router.push("/profile")}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mb-2"
              >
                🎁 {t("home.claimButton")}
              </button>
              <button
                onClick={() => router.push("/tasks")}
                className="w-full text-sm text-gray-300 hover:text-white"
              >
                {t("home.exploreButton")} →
              </button>
            </div>
          </div>
        )}
      </div>
      {/* <BottomNavbar hasGameSecret={hasGameSecret} /> */}
    </div>
  );
}
