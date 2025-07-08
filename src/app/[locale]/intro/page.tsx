"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImSpinner3 } from "react-icons/im";

const coins = [
  "94202 EX9630 Coins for 900,000 Winners",
  "1,000,000 EX9630 Coins for 90,000 Winners",
  "10,000,000 EX9630 Coins for 9,000 Winners",
  "100,000,000 EX9630 Coins for 900 Winners",
  "1,000,000,000 EX9630 Coins for 90 Winners",
  "10,000,000,000 EX9630 Coins for 9 Winners",
];

export default function PlayIntro() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   const redirectDelay = setTimeout(() => {
  //     router.replace("/");
  //   }, 3000);

  //   return () => clearTimeout(redirectDelay);
  // }, [router]);

  const goToGame = () => {
    try {
      // setIsLoading(true);
      router.push(`/${locale}/`);
    } catch (error) {
      console.log(error);

      // setIsLoading(false);
    } finally {
      // setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center relative min-h-screen px-4">
      <svg
        className="absolute top-0 left-4 sm:left-20"
        width="40"
        height="22"
        viewBox="0 0 40 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M39.6794 13.3003C38.8546 11.0859 37.4995 9.1018 35.7314 7.5197C33.9633 5.9376 31.8353 4.80513 29.5317 4.22023C30.7297 13.504 22.4216 12.9047 22.4216 12.9047C23.5253 11.4581 22.206 9.83418 22.206 9.83418C20.7035 10.1923 20.5849 12.3312 20.5849 12.3312C19.6136 11.5034 18.1898 11.8134 18.1898 11.8134C18.4048 11.2937 18.4811 10.7272 18.4114 10.1685C18.3417 9.60976 18.1283 9.07761 17.7917 8.62328C16.0288 9.40176 16.3028 11.7134 16.3028 11.7134C9.41402 6.469 15.8349 0.6208 15.8349 0.6208C5.09168 0.810397 0.885674 5.51227 0.885674 5.51227C12.4265 4.59953 6.91348 12.8544 5.00005 13.9767C11.166 10.5084 10.2129 16.7986 10.2129 16.7986C12.0488 13.1773 15.03 14.408 15.03 14.408C15.0256 18.5364 17.8466 19.3103 17.8466 19.3103L17.7552 21.4521L18.7651 19.5622C19.6813 19.3873 20.5224 18.9439 21.1801 18.289C21.8378 17.6342 22.2819 16.7979 22.4552 15.8881C25.4308 15.5861 25.9522 19.0606 25.9522 19.0606C28.2498 11.6916 33.8277 17.3976 33.8277 17.3976C32.1636 8.78874 39.6794 13.3003 39.6794 13.3003ZM16.2867 12.9154C17.7833 12.5789 18.3759 14.036 18.3759 14.036C16.6296 14.2761 16.2812 12.9185 16.2812 12.9185L16.2867 12.9154ZM19.4318 14.3163C19.4318 14.3163 20.2275 13.2076 21.7976 13.9167C21.7965 13.921 21.032 14.8991 19.433 14.312L19.4318 14.3163Z"
          fill="#3D3C3C"
        />
      </svg>
      <p className="text-primary text-[34px] bg-gradient-to-r from-[#F68E00] via-[#FFEA94] to-[#FFBD00] bg-clip-text text-transparent font-bold text-center p-8 pb-0 text-gradient">
        {t("intro.title")}
      </p>
      <p className="text-white text-[24px]  font-bold text-center p-2 mt-4">
        {t("intro.des")}
      </p>
      <div className="flex items-center justify-center flex-col text-white gap-8 text-titleMedium mt-8">
        {(() => {
          const arr = Array.isArray(coins) ? coins : [];
          return arr.map((coin: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1125 0.861037C10.1812 0.0749661 8.8188 0.0749673 7.88749 0.861037L7.03932 1.57692C6.64349 1.91102 6.15365 2.11394 5.6375 2.15759L4.53155 2.25111C3.31717 2.35381 2.35381 3.31717 2.25111 4.53155L2.15759 5.6375C2.11394 6.15365 1.91102 6.64349 1.57692 7.03934L0.861037 7.88749C0.0749661 8.8188 0.0749673 10.1812 0.861037 11.1125L1.57692 11.9607C1.91102 12.3565 2.11394 12.8464 2.15759 13.3625L2.25111 14.4685C2.35381 15.6829 3.31717 16.6462 4.53155 16.7489L5.6375 16.8424C6.15365 16.8861 6.64349 17.089 7.03934 17.4231L7.88749 18.139C8.8188 18.925 10.1812 18.925 11.1125 18.139L11.9607 17.4231C12.3565 17.089 12.8464 16.8861 13.3625 16.8424L14.4685 16.7489C15.6829 16.6462 16.6462 15.6829 16.7489 14.4685L16.8424 13.3625C16.8861 12.8464 17.089 12.3565 17.4231 11.9607L18.139 11.1125C18.925 10.1812 18.925 8.8188 18.139 7.88749L17.4231 7.03932C17.089 6.64349 16.8861 6.15365 16.8424 5.6375L16.7489 4.53155C16.6462 3.31717 15.6829 2.35381 14.4685 2.25111L13.3625 2.15759C12.8464 2.11394 12.3565 1.91102 11.9607 1.57692L11.1125 0.861037ZM14.046 7.79555C14.4854 7.35621 14.4854 6.6439 14.046 6.20456C13.6067 5.76521 12.8944 5.76521 12.455 6.20456L8.25054 10.4091L6.54604 8.70456C6.1067 8.26521 5.39439 8.26521 4.95505 8.70456C4.5157 9.1439 4.5157 9.85621 4.95505 10.2956L7.45505 12.7955C7.89439 13.2349 8.6067 13.2349 9.04604 12.7955L14.046 7.79555Z"
                  fill="#3ED37A"
                />
              </svg>
              <span className="text-[15px] font-700 ">{coin}</span>
            </div>
          ));
        })()}
      </div>
      <div className="py-5 w-full flex justify-center">
        <div className="w-full max-w-sm px-4">
          <button
            className="w-full py-2 rounded-xl border-2 bg-[#c956aee5] border-[#C643A8E5] text-white font-medium hover:bg-[#C643A8E5]/20 transition flex items-center gap-2 justify-center"
            onClick={goToGame}
          >
            {t("global.startGame")}
          </button>
        </div>
      </div>
    </div>
  );
}
