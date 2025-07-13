import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { IoMdClose } from "react-icons/io";

type TransactionModal = {
  isOpen: boolean;
  onClose?: () => void;
};

const TransactionDoneModal = ({ isOpen ,onClose}: TransactionModal) => {
  const t = useTranslations();

  return (
    isOpen && (
      <div className="flex flex-col  justify-center border border-[#C643A8E5] text-center px-6 pt-6 pb-8 items-center bg-[#7D7D7D]/30 backdrop-blur-sm absolute left-1/2  top-[30vh] max-w-4/5 min-w-4/5 -translate-x-1/2 rounded-xl">
        <div className="w-full flex justify-end">
          <button className="p-1" onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col items-center gap-4">
            <div>
              <img src="/CircleClock.svg" alt="clock" />
            </div>
            <div className="text-[14px] font-[400]">
              {t("global.transactionDone")}
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <Link
              href="/transactionHistory"
              className="rounded-full border border-white bg-transparent text-white px-4 py-2"
            >
              {t("global.backToTransactions")}
            </Link>
          </div>
        </div>
      </div>
    )
  );
};
export default TransactionDoneModal;
