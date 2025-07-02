"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { FaArrowLeft, FaReceipt } from "react-icons/fa";
import { useApi } from "@/context/api";

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
  const { api } = useApi();
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Fetch transaction history
  const fetchTransactionHistory = useCallback(async () => {
    try {
      // Try the correct API endpoint first
      const res = await api.get("/mainuser/withdraw-requests");
      if (res.status === 200) {
        setTransactionHistory(res.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      // If the API fails, show empty state instead of crashing
      setTransactionHistory([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Fetch data on mount
  useEffect(() => {
    fetchTransactionHistory();
  }, [fetchTransactionHistory]);

  // Navigate back
  const goBack = () => {
    router.back();
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
        return "text-white";
    }
  };

  return (
    <div>
      <div className="w-6 h-6">
        <button
          className="rounded-full text-white border border-[#FF4ED3] flex items-center p-2 bg-white/20 hover:bg-white/30 transition-colors"
          onClick={goBack}
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#7D7D7D]/30 backdrop-blur-md border border-[#C643A8E5] text-center flex flex-col items-center py-6 px-4 rounded-xl mt-6 gap-6">
        <div className="w-full flex items-center justify-start gap-2">
          <FaReceipt className="w-[22px] h-[22px] text-white" />
          <span className="font-semibold text-[14px] text-white">
            {t("transaction.history")}
          </span>
        </div>
        <div className="w-full flex flex-col items-center gap-2 text-[14px] font-normal max-h-[60vh] overflow-auto">
          {transactionHistory.length > 0 ? (
            transactionHistory.map((transaction) => (
              <div
                key={transaction.id}
                className="flex w-full justify-between items-center gap-2 p-2 border-b border-white/10"
              >
                <div className="text-white">
                  {Number(transaction.amount).toFixed(2)} -{" "}
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
                <p
                  className={`${getStatusColor(transaction.status)} capitalize`}
                >
                  {transaction.status}
                </p>
              </div>
            ))
          ) : (
            <p className="text-white">{t("transaction.noTransactions")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
