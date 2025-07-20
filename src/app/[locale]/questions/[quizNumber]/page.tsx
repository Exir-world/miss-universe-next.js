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
import QuestionImageSkeleton from "@/components/questionImageSkeleton";

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

  // Helper function to find next unanswered question
  const findNextUnansweredQuestion = (currentIndex: number) => {
    return questions.find((q, index) => {
      // Skip the current question and find the next unanswered one
      if (index <= currentIndex) return false;
      return !q.answered;
    });
  };

  // Find the current question by order
  const currentQuestion = questions.find(
    (q) => q.order === parseInt(questionNumber || "1")
  );
  const currentIndex = questions.findIndex(
    (q) => q.order === parseInt(questionNumber || "1")
  );

  // Redirect to next unanswered question if current question is already answered
  useEffect(() => {
    if (currentQuestion && currentQuestion.answered) {
      const nextUnanswered = findNextUnansweredQuestion(currentIndex);
      if (nextUnanswered) {
        router.push(`/questions/qNum?id=${nextUnanswered.order}`);
      } else {
        // All questions are answered, go back to questions list
        router.push("/questions");
      }
    }
  }, [currentQuestion, currentIndex, router]);

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
      // submitAnswer(currentIndex, optionId);
      setTimeout(async () => {
        setAnimating(false);
        // Find the next unanswered question
        const nextUnansweredQuestion = findNextUnansweredQuestion(currentIndex);

        if (nextUnansweredQuestion) {
          router.push(`/questions/qNum?id=${nextUnansweredQuestion.order}`);
        } else {
          // Check if all questions are answered
          const allAnswered = questions.every((q) => q.answered);
          console.log(allAnswered, "all questions answered");
          
          if (allAnswered) {
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

  const handleAnswe = async (
    optionId: number,
    questionId: number,
    isCorrect
  ) => {
    if (selectedAnswer !== null || animating) return;
    setSelectedAnswer(optionId);
    setIsCorrect(isCorrect);
    setAnimating(true);

    if (isCorrect) {
      setAnimating(false);
      const res = submitAnswer(questionId, optionId, api);

      // Find the next unanswered question
      const nextUnansweredQuestion = findNextUnansweredQuestion(currentIndex);

      if (nextUnansweredQuestion) {
        router.push(`/questions/qNum?id=${nextUnansweredQuestion.order}`);
      } else {
        // Check if all questions are answered
        const allAnswered = questions.every((q) => q.answered);
        console.log(allAnswered, "all questions answered");

        if (allAnswered) {
          try {
            await api.post("/mysteries/check-answer", {
              answers: Array(9).fill(1),
            });
            toast.success(t("success.allCorrect"));
          } catch (e) {
            toast.error(t("error.unknownError"));
          }
        }
        setTimeout(() => {
          router.push("/questions");
        }, 1000);
      }
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
        <div className="w-full h-[300px] relative">
          {currentQuestion.imageUrl ? (
            <Image
              className="border rounded-lg"
              src={`/api/image?url=${currentQuestion.imageUrl}`}
              alt="quiz"
              layout="fill"
              objectFit="contain"
              priority
            />
          ) : (
            <QuestionImageSkeleton></QuestionImageSkeleton>
          )}
        </div>
        <p className="text-center text-[16px] font-[600] py-3 ">
          {currentQuestion?.text}
        </p>
        <div className="flex flex-col items-center justify-center mt-4 gap-2">
          {currentQuestion?.options?.map((option, index) => {
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
                  // onClick={() => handleAnswer(option?.id, option?.isCorrect)}
                  onClick={() =>
                    handleAnswe(
                      option?.id,
                      currentQuestion.id,
                      option?.isCorrect
                    )
                  }
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
