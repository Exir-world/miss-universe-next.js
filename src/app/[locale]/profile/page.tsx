"use client";
import Avatar from "@/components/avatar";
import DoneTasks from "@/components/doneTasks";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClaimRewardButton from "@/components/profileWinnButton";
import TransactionDoneModal from "@/components/transactionDone";
import WithdrawButton from "@/components/withdrawButton";
import { useApi } from "@/context/api";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuCircleHelp } from "react-icons/lu";
import { toast } from "react-toastify";

type Coin = {
  id: number;
  name: string;
  fullName: string;
  icon: string;
  fraction: number;
  deleted: boolean;
};

type Wallet = {
  id: number;
  userId: number;
  coinId: number;
  balance: string; // assuming it's a string from your data
  blocked: string; // assuming it's a string from your data
  walletType: string;
  withdrawAccess: boolean;
  coin: Coin;
};

function Page() {
  const t = useTranslations();
  const { firstname, api } = useApi();
  const [loading, setLoading] = useState(true);
  const [walletId, setWalletId] = useState<any>(null);
  const [coinPrice, setCoinPrice] = useState<any>(null);
  const [walletData, setWalletData] = useState<Wallet[]>([]);

  const [transactionDone, setTransactionDone] = useState(false);
  const getWalletData = async () => {
    try {
      const res = await api.get("/wallets/user/tg");
      const coinInfo = res.data.data.map((el: any) => ({
        id: el.id,
        balance: el.balance,
        coin: el.coin, // Keep the full coin object
        icon: el.coin.icon,
      }));

      setWalletData(coinInfo);
      // setWalletId(res.data.data[0]?.id || null);
    } catch (e) {
      toast.error(t("global.errors.resourceNotFound"));
    } finally {
      setLoading(false);
    }
  };

  // const getCoinPrice = async () => {
  //   if (walletData.length === 0 || !walletData[0].coin.id) return;

  //   const coinId = walletData[0].coin.id;
  //   try {
  //     const { data } = await api.get(
  //       `/prices/latest?coinId=${coinId}&baseCoinId=3`
  //     );
  //     if (data) {
  //       console.log(data,'+++++');

  //       setCoinPrice(data);
  //     }
  //   } catch (err) {
  //     toast.error(t("global.errors.resourceNotFound99"));
  //   }
  // };

  useEffect(() => {
    getWalletData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full h-full ">
      <div className="border border-[#C643A8E5] rounded-lg bg-[#7D7D7D4D]/30 px-4 pt-4 pb-6 w-full flex flex-col items-center">
        <div className="flex items-center justify-between w-full">
          {/* <span>{t("", { nickname: firstname || "User" })}</span> */}
          <div className="flex items-center text-white gap-4 justify-between w-full p-2">
            <Avatar nickName={firstname || "User"} />
            <LanguageSwitcher />
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
        <div className="w-full flex flex-col items-center justify-between py-4">
          <h3 className="text-center w-full border-b border-[#C643A8E5] pb-2">
            <p>{t("profile.balance")}</p>
            <p className="font-[500] text-[25px]">
              {walletData.length > 0
                ? walletData.map((wallet) => wallet.balance)
                : 0}
            </p>
          </h3>

          <div className="flex w-full items-center  gap-2 py-2 ">
            {walletData.length > 0 ? (
              <>
                {walletData.map((wallet, id) => {
                  return (
                    <div className="w-full flex items-center gap-2" key={id}>
                      <Image
                        src={(wallet as any).icon}
                        height={30}
                        width={30}
                        alt="logo"
                      />{" "}
                      <p>{wallet.balance}</p>
                      <p className="font-[500] bg-gradient-to-r from-[#F68E00] via-[#FFEA94] to-[#FFBD00] bg-clip-text text-transparent">
                        {wallet.coin.name}
                      </p>
                    </div>
                  );
                })}
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        <WithdrawButton onTransaction={setTransactionDone}></WithdrawButton>

        <TransactionDoneModal
          isOpen={transactionDone}
          onClose={() => setTransactionDone(false)}
        ></TransactionDoneModal>
      </div>
    </div>
  );
}
export default Page;
