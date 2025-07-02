"use client";

import AnswerItem from "@/components/answerItem";
import Spinner from "@/components/spinner";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type QuizOption = {
  id: number;
  text: string;
  isCorrect: boolean;
  order: number;
};

type QuizQuestion = {
  id: number;
  text: string;
  imageUrl: string;
  order: number;
  options: QuizOption[];
};

function Page() {
  const params = useSearchParams();
  const questionNumber = params.get("id");
  const t = useTranslations();
  const [currentQuesion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null
  );

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure client-side
    try {
      const questions = JSON.parse(
        localStorage.getItem("miss_questions") || "[]"
      );

      if (questions.length > 0) {
        const question = questions.find(
          (q) => q.order == parseInt(questionNumber || "1")
        );
        setCurrentQuestion(question);
      }
    } catch (error) {
      toast.error(t("error.unknownError"));
    }
  }, [questionNumber]);

  console.log(currentQuesion, "currentQuesion");

  const answerQuestion = (ques)=>{
    console.log(ques, "ques");
    

  }
  return (
    <div>
      {currentQuesion ? (
        currentQuesion.imageUrl ? (
          <div
            style={{ position: "relative" }}
            className="w-full h-[300px] absolute top-0 left-0 right-0 "
          >
            <Image
              src={currentQuesion.imageUrl}
              alt="quiz"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        ) : (
          <Spinner />
        )
      ) : (
        <Spinner />
      )}
      <p className="text-center text-[16px] font-[600] ">
        {currentQuesion?.text}
      </p>

      <div className="flex flex-col items-center justify-center mt-4 gap-2">
        {currentQuesion?.options.map((option, index) => {
          return (
            <AnswerItem text={option.text} onClick={() => answerQuestion(option)} />
          );
        })}
      </div>
    </div>
  );
}

export default Page;
