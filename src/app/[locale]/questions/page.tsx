"use client";
import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import AnswerItem from "@/components/answerItem";
import WinnerButton from "@/components/winnerButton";
import { IoArrowBackSharp } from "react-icons/io5";

const QuestionsPage = () => {
  // const t = useTranslations();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full flex items-center justify-start my-4 fixed top-8 px-4 left-0 right-0">
        <button
          className="p-2 text-white bg-gray-800 rounded-full border border-[#C643A8E5] "
          onClick={() => router.push("/")}
        >
          <IoArrowBackSharp></IoArrowBackSharp>
        </button>
      </div>
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-2 justify-center ">
          <AnswerItem></AnswerItem>
          <AnswerItem></AnswerItem>
          <AnswerItem></AnswerItem>
          <AnswerItem></AnswerItem>
        </div>

        {/* <WinnerButton></WinnerButton> */}
      </div>
    </div>
  );
};

export default QuestionsPage;
