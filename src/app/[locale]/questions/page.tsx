"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import WinnerButton from "@/components/winnerButton";
import { IoArrowBackSharp } from "react-icons/io5";
import { useApi } from "@/context/api";
import Image from "next/image";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useLoginStoreState } from "@/stores/context";
import { useQuestionsStore } from "@/stores/questions";

type Option = {
  id: number;
  text: string;
  isCorrect: boolean;
  order: number;
};

type Question = {
  id: number;
  text: string;
  imageUrl: string;
  order: number;
  options: Option[];
};

type QuizResponse = {
  data: Question[];
};

const QuestionsPage = () => {
  // const t = useTranslations();
  const router = useRouter();
  const { api } = useApi();
  const { questions, loading, fetchQuestions, answers, submitAnswers } =
    useQuestionsStore();

  const t = useTranslations();

  useEffect(() => {
    fetchQuestions(api);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (questions.length > 0) {
      localStorage.setItem("miss_questions", JSON.stringify(questions));
    }
  }, [api, fetchQuestions]);

  const allAnswered = answers.filter((a) => a !== -1).length === 9;

  const handleSubmit = async () => {
    try {
      const res = await submitAnswers(api);
      if ((res as any).data) router.push("/");

      // toast.success(t("success.allCorrect"));
    } catch (e) {
      toast.error(t("errors.unknownError"));
    }
  };

  if (loading) return;

  console.log(questions, "questionsx");

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
      <div className="grid grid-cols-3 justify-center relative gap-4 mt-8 p-2 flex-wrap">
        {questions.length > 0 && !loading
          ? questions.map((question, index) => {
              const questionIdx = questions.findIndex(
                (q) => q.id === question.id
              );
              const isAnswered = answers[questionIdx] !== -1;
              return (
                <div key={index} className="relative w-fit">
                  <Image
                    className="rounded-[15px] relative border border-[#C643A8E5]"
                    onClick={() =>
                      router.push(`/questions/qNum?id=${question.order}`)
                    }
                    src={question.imageUrl}
                    width={150}
                    height={150}
                    priority={index < 3}
                    alt="pic"
                  />
                  {/* {isAnswered && (
                    <div className="absolute z-50 bg-black/40 flex items-center justify-center rounded-xl left-0 right-0 top-0 bottom-0">
                      <span className="text-green-400 text-3xl font-bold">
                        ✓
                      </span>
                    </div>
                  )} */}
                </div>
              );
            })
          : null}
      </div>
      <div className="w-full max-w-md flex flex-col items-center mt-8 px-2">
        {allAnswered && (
          <button
            className="w-full py-2 rounded-xl border-2 bg-[#c956aee5] border-[#C643A8E5] text-white font-medium  hover:bg-[#C643A8E5]/20 transition"
            onClick={handleSubmit}
          >
            {t("questions.submit")}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
