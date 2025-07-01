"use client";
import Avatar from "@/components/avatar";
import DoneTasks from "@/components/doneTasks";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClaimRewardButton from "@/components/profileWinnButton";
import WithdrawButton from "@/components/withdrawButton";
import { useApi } from "@/context/api";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LuCircleHelp } from "react-icons/lu";

function Page() {
  const t = useTranslations();
  const { firstname } = useApi();

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full h-full ">
      <div className="border border-[#C643A8E5] rounded-lg bg-[#7D7D7D4D]/30 px-4 pt-4 pb-6 w-full flex flex-col items-center">
        <div className="flex items-center justify-between w-full">
          <span>{t("", { nickname: firstname || "User" })}</span>
          <div className="flex items-center text-white gap-4 justify-between w-full p-2">
            <Avatar nickName={firstname || "User"} />
            <LanguageSwitcher />
            <Link href={"https://cicada1919.ex.pro"} target="_blank">
              <LuCircleHelp size={24} />
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-col justify-center items-center px-2 pt-7 gap-4 font-[600] text-[14px] tracking-wider">
          <DoneTasks />
        </div>
        {/* <div>
          <ClaimRewardButton
            isWinner={true}
            onClick={""}
            label={"claim your prize"}
          ></ClaimRewardButton>
        </div> */}
      </div>

      <div className="border border-[#C643A8E5] rounded-lg bg-[#7D7D7D4D]/30 px-4 pt-4 pb-6 w-full flex flex-col items-center">
        <WithdrawButton></WithdrawButton>
      </div>
    </div>
  );
}
export default Page;
