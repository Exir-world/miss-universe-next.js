"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/context/api";
import { FaUsers } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { IoReceiptOutline } from "react-icons/io5";
import { BiTask } from "react-icons/bi";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { GiWoodenChair } from "react-icons/gi";
import { useLoginStoreState } from "@/stores/context";
import { useTranslations } from "next-intl";

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
  const { userData } = useLoginStoreState();
  const t = useTranslations();
  const [data, setData] = useState<DoneTasksData | null>(null);

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
      setData({
        doneTasksCount: 0,
        referralRewardsAmount: 0,
        referralsCount: 0,
        taskRewardsAmount: "0",
        tasksCount: 0,
        withdrawCount: 0,
      });
    }
  };

  useEffect(() => {
    fetchDoneTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col justify-center items-center px-2 pt-7 gap-4  text-sm ">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <FaUsers size={24} />
          {t("global.friends")} {data?.referralsCount}
        </div>
        <p>{data?.referralRewardsAmount} EX9630</p>
      </div>

      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <BiTask size={24} />
          {t("global.tasks")}
          {data?.doneTasksCount}/{data?.tasksCount}
        </div>
        <p>{data?.taskRewardsAmount} EX9630</p>
      </div>

      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <IoReceiptOutline size={24} />
          {t("global.withdraw")}
          {data?.withdrawCount}
        </div>
        <Link href="/transactionHistory" className="text-blue-600">
          {t("global.history")}
        </Link>
      </div>

      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <MdOutlineMeetingRoom size={24} /> {t("global.room")}
        </div>
        <p>{userData.mystery.room ?? "-"}</p>
      </div>

      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <GiWoodenChair size={24} />
          {t("global.chair")}
        </div>
        <p>{userData.mystery.session ?? "-"}</p>
      </div>
    </div>
  );
}
