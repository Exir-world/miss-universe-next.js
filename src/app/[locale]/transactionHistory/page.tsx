"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaReceipt, FaChevronDown } from "react-icons/fa";

// Define the Transaction interface
interface Transaction {
  adminDescription: string | null;
  amount: number;
  createdAt: string; // ISO date string
  description: string | null;
  destinationWalletAddress: string;
  fee: string;
  feeWalletId: number;
  id: number;
  status: "pending" | "cancelled" | "rejected" | "completed" | "waiting";
  userId: number;
  walletId: number;
}

export default function TransactionHistory() {
  const router = useRouter();
  const t = useTranslations();
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );

  // Simulate runtime config for gameName (replace with actual Next.js env variable)
  const gameName = process.env.NEXT_PUBLIC_GAME_NAME || "Dubaieid";

  // Fetch transaction history
  const fetchTransactionHistory = async () => {
    try {
      const res = await fetch("/api/withdraw-requests", {
        headers: {
          "Content-Type": "application/json",
          "X-Game": gameName,
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        setTransactionHistory(data?.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  // Navigate to profile
  const goToQuestions = () => {
    router.back()
  };

  // Compute status colors
  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return "text-[#FFA641]";
      case "cancelled":
        return "text-[#FF6969]";
      case "rejected":
        return "text-[#FF6969]";
      case "completed":
        return "text-[#45E184]";
      case "waiting":
        return "text-white";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="w-6 h-6">
        <button
          className="rounded-full text-white border border-[#FF4ED3] flex items-center p-2 bg-white/20 hover:bg-white/30 transition-colors"
          onClick={goToQuestions}
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#7D7D7D]/30 backdrop-blur-md border border-[#C643A8E5] text-center flex flex-col items-center py-6 px-4 rounded-xl mt-6 gap-6">
        <div className="w-full flex items-center justify-start gap-2">
          <FaReceipt className="w-[22px] h-[22px] text-white" />
          <span className="font-semibold text-[14px] text-white">
            {"Transaction History"}
          </span>
        </div>
        <div className="w-full flex flex-col items-center gap-2 text-[14px] font-normal max-h-[60vh] overflow-auto">
          {transactionHistory.length > 0 ? (
            transactionHistory.map((transaction) => (
              <div
                key={transaction.id}
                className="flex w-full justify-between items-center gap-2"
              >
                <div className="text-white">
                  {Number(transaction.amount).toFixed(2)} -{" "}
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
                <p className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </p>
              </div>
            ))
          ) : (
            <p className="text-white">No transactions found.</p>
          )}
        </div>
        {/* Uncomment if you want to include the arrow down icon */}
        {/* <div className="w-full flex items-center justify-center">
          <FaChevronDown className="w-[22px] h-[22px] text-white" />
        </div> */}
      </div>
    </div>
  );
}
