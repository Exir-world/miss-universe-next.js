"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/context/api";
import { useTranslations } from "next-intl";
import { FaUsers } from "react-icons/fa";
import { MdTask } from "react-icons/md";
import { BsReceipt } from "react-icons/bs";
import { Link } from "@/i18n/navigation";

interface DoneTasksData {
  doneTasksCount: number;
  referralRewardsAmount: number;
  referralsCount: number;
  taskRewardsAmount: string;
  tasksCount: number;
  withdrawCount: number;
}

export default function DoneTasks() {
  const { api } = useApi();

  const [data, setData] = useState<DoneTasksData | null>(null);
  const t = useTranslations();

  const fetchDoneTasks = async () => {
    try {
      const res = await api.get("/mainuser/rewards", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  useEffect(() => {
    fetchDoneTasks();
  }, []);

  return (
    <div className="flex w-full flex-col justify-center items-center px-2 pt-7 gap-4 font-semibold text-sm tracking-wider">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <FaUsers size={24} />
          friends {data?.referralsCount}
        </div>
        <p>{data?.referralRewardsAmount} EX9630</p>
      </div>

      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <MdTask size={24} />
          {data?.doneTasksCount}/{data?.tasksCount}
        </div>
        <p>{data?.taskRewardsAmount} EX9630</p>
      </div>

      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <BsReceipt size={24} />
          {data?.withdrawCount}
        </div>
        <Link href="/transactionHistory" className="text-blue-600">
          history
        </Link>
      </div>
    </div>
  );
}
