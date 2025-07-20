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
import { MdDone } from "react-icons/md";

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
  answered: boolean;
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
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  const t = useTranslations();

  // Helper function to find next unanswered question
  const findNextUnansweredQuestion = (currentIndex: number) => {
    return questions.find((q, index) => {
      // Skip the current question and find the next unanswered one
      if (index <= currentIndex) return false;
      return !q.answered;
    });
  };

  // Function to handle question click
  const handleQuestionClick = (question: Question, questionIndex: number) => {
    if (question.answered) {
      // If question is already answered, find next unanswered question
      const nextUnanswered = findNextUnansweredQuestion(questionIndex);
      if (nextUnanswered) {
        router.push(`/questions/qNum?id=${nextUnanswered.order}`);
      } else {
        // All questions are answered, show message or redirect
        toast.info(t("questions.allAnswered"));
      }
    } else {
      // If question is not answered, go to it
      router.push(`/questions/qNum?id=${question.order}`);
    }
  };

  useEffect(() => {
    fetchQuestions(api);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setAllQuestions(questions);
    }
    // Only run when questions changes
    // eslint-disable-next-line
  }, [questions]);

  const allAnswered = questions.every((quiz, ind) => quiz.answered);

  const handleSubmit = async () => {
    try {
      await submitAnswers(api);

      router.push("/");

      // toast.success(t("success.allCorrect"));
    } catch (e) {
      console.log(e);

      toast.error(t("errors.unknownError"));
    }
  };

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
        {allQuestions.length > 0 &&
          allQuestions.map((question, index) => {
            const questionIdx = allQuestions.findIndex(
              (q) => q.id === question.id
            );
            const isAnswered = answers[questionIdx] !== -1;
            return (
              <div key={question.id} className="relative w-full ">
                <div
                  onClick={() => handleQuestionClick(question, index)}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    className="rounded-[15px] relative border border-[#C643A8E5]"
                    src={`/api/image?url=${encodeURIComponent(
                      question.imageUrl
                    )}`}
                    width={150}
                    height={150}
                    alt="Qpic"
                    unoptimized={false} // Enable Next.js image optimization and caching
                    priority={index === 0}
                  />
                </div>
                {question.answered && (
                  <div className="absolute z-50 bg-black/40 flex items-center justify-center rounded-xl left-0 right-0 top-0 bottom-0">
                    <span className="text-green-400 text-3xl font-bold">
                      <MdDone size={30}></MdDone>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
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
