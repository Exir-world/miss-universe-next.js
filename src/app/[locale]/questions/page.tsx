"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import WinnerButton from "@/components/winnerButton";
import { IoArrowBackSharp } from "react-icons/io5";
import { useApi } from "@/context/api";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useLoginStoreState } from "@/stores/context";

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
  const {} = useLoginStoreState();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const getQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `questions/active?game=${process.env.NEXT_PUBLIC_GAME_NAME}`
      );
      if (res.status == 200) {
        setQuestions(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      toast.error(t("error.resourceNotFound"));
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    getQuestions();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) return;

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
      <div className="grid grid-cols-3 w-full gap-2">
        {questions.length > 0 && !loading
          ? questions.map((question, index) => {
              return (
                <Image
                  className="rounded-md"
                  onClick={() => router.push(`/questions/${index + 1}`)}
                  key={index}
                  src={question.imageUrl}
                  width={150}
                  height={150}
                  // placeholder="blur"
                  priority={index < 3}
                  alt="pic"
                />
              );
            })
          : null}
      </div>
      <div className="w-full max-w-md">
        {/* <WinnerButton></WinnerButton> */}
      </div>
    </div>
  );
};

export default QuestionsPage;
