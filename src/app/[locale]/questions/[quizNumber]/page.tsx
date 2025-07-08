"use client";

import AnswerItem from "@/components/answerItem";
import Spinner from "@/components/spinner";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuestionsStore } from "@/stores/questions";
import { useApi } from "@/context/api";
import { useRouter } from "@/i18n/navigation";
import { IoArrowBackSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

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
  const router = useRouter();
  const { api } = useApi();

  // Use zustand store
  const { questions, answers, submitAnswer, fetchQuestions } =
    useQuestionsStore();

  // Fetch questions if empty (for reload)
  useEffect(() => {
    if (questions.length === 0) {
      fetchQuestions(api);
    }
  }, [questions.length, fetchQuestions, api]);

  // Find the current question by order
  const currentQuestion = questions.find(
    (q) => q.order === parseInt(questionNumber || "1")
  );
  const currentIndex = questions.findIndex(
    (q) => q.order === parseInt(questionNumber || "1")
  );

  // Local state for answer feedback
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [animating, setAnimating] = useState(false);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAnimating(false);
  }, [currentIndex]);

  // Handle answer click
  const handleAnswer = async (optionId: number, isOptionCorrect: boolean) => {
    if (selectedAnswer !== null || animating) return; // Only allow one answer
    setSelectedAnswer(optionId);
    setIsCorrect(isOptionCorrect);
    setAnimating(true);
    if (isOptionCorrect) {
      submitAnswer(currentIndex, optionId);
      setTimeout(async () => {
        setAnimating(false);
        // Go to next question or finish
        const nextQuestion = questions[currentIndex + 1];
        if (nextQuestion) {
          router.push(`/questions/qNum?id=${nextQuestion.order}`);
        } else {
          // All questions answered, check if all correct
          const allCorrect = questions.every((q, idx) => {
            const ansId = idx === currentIndex ? optionId : answers[idx];
            return q.options.find((o) => o.id === ansId)?.isCorrect;
          });
          if (allCorrect) {
            try {
              await api.post("/mysteries/check-answer", {
                answers: answers.map((a, idx) =>
                  idx === currentIndex ? optionId : a
                ),
              });
              toast.success(t("success.allCorrect"));
            } catch (e) {
              toast.error(t("error.unknownError"));
            }
          }
          // Redirect to questions list after a short delay
          setTimeout(() => {
            router.push("/questions");
          }, 1000);
        }
      }, 500);
    } else {
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setAnimating(false);
      }, 700);
    }
  };

  // Loading state
  if (!currentQuestion) {
    return <Spinner />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full flex items-center justify-start my-4  px-4 ">
          <button
            className="p-2 text-white bg-gray-800 rounded-full border border-[#C643A8E5] "
            onClick={() => router.push("/questions")}
          >
            <IoArrowBackSharp></IoArrowBackSharp>
          </button>
        </div>
        {currentQuestion.imageUrl && typeof currentQuestion.imageUrl === "string" && (
          <div
            style={{ position: "relative" }}
            className="w-full h-[300px] absolute top-0 left-0 right-0 "
          >
            <Image
              src={currentQuestion.imageUrl}
              alt="quiz"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        )}
        <p className="text-center text-[16px] font-[600] py-3">
          {currentQuestion.text}
        </p>
        <div className="flex flex-col items-center justify-center mt-4 gap-2">
          {currentQuestion.options.map((option, index) => {
            let state: "default" | "correct" | "incorrect" = "default";
            if (selectedAnswer === option.id) {
              state =
                isCorrect === true
                  ? "correct"
                  : isCorrect === false
                    ? "incorrect"
                    : "default";
            }
            return (
              <div key={option.id} className="w-full">
                <AnswerItem
                  text={option.text}
                  onClick={() => handleAnswer(option.id, option.isCorrect)}
                  state={state}
                />
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Page;
