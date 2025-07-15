import { create } from "zustand";
import { useLoginStoreState } from "./context";
import { getQuestionImageUrl, shouldUseLocalImages } from "@/lib/apiUtils";

export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface Question {
  id: number;
  text: string;
  imageUrl: string;
  order: number;
  options: Option[];
}

interface QuestionsState {
  questions: Question[];
  answers: number[];
  loading: boolean;
  error: string | null;
  nextStep: number;
  fetchQuestions: (api: any) => Promise<void>;
  submitAnswer: (qn: number, answer: number) => void;
  submitAnswers: (api: any) => Promise<void>;
  reset: () => void;
}

const DEFAULT_ANSWERS = Array(9).fill(-1);

function saveAnswersToLocalStorage(answers: number[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      `answers_${process.env.NEXT_GAME_NAME}`,
      JSON.stringify(answers)
    );
  }
}

function loadAnswersFromLocalStorage(): number[] {
  if (typeof window === "undefined") return [...DEFAULT_ANSWERS];
  const stored = localStorage.getItem(`answers_${process.env.NEXT_GAME_NAME}`);
  return stored ? JSON.parse(stored) : [...DEFAULT_ANSWERS];
}

// Function to process questions and replace image URLs with local ones if needed
function processQuestions(questions: Question[]): Question[] {
  if (!shouldUseLocalImages()) {
    return questions;
  }

  return questions.map((question, index) => ({
    ...question,
    imageUrl: getQuestionImageUrl(question.order),
  }));
}

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  questions: [],
  answers: loadAnswersFromLocalStorage(),
  loading: false,
  error: null,
  nextStep: 0,

  fetchQuestions: async (api) => {
    set({ loading: true, error: null });
    try {
      // Get language from next-intl cookie
      const lang =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("NEXT_LOCALE="))
          ?.split("=")[1] || "en"; // get lang

      // if (!questionsExits) {
      const res = await api.get(
        `questions/active?game=${process.env.NEXT_PUBLIC_GAME_NAME}`
        // {
        //   headers: {
        //     "X-Game": process.env.NEXT_PUBLIC_GAME_NAME,
        //     "accept-language": lang,
        //   },
        // }
      );
      if (res.status === 200 || res.status === 201) {
        // localStorage.setItem("miss_questions", JSON.stringify(res.data.data));
        const sortedQuestions = res.data.data
          .slice()
          .sort((a: Question, b: Question) => a.order - b.order);

        // Process questions to use local images if needed
        const processedQuestions = processQuestions(sortedQuestions);

        set({ questions: processedQuestions, loading: false });
      } else {
        set({ error: "Failed to fetch questions", loading: false });
      }
    } catch (err) {
      console.error("Error fetching questions:", err);

      set({ error: "Failed to fetch questions", loading: false });
    }
  },

  submitAnswer: (qn, answer) => {
    const answers = [...get().answers];
    answers[qn] = answer;
    set({ answers });
    saveAnswersToLocalStorage(answers);
    // Update nextStep
    const next = answers.findIndex((a) => a === -1);
    set({ nextStep: next });
  },

  submitAnswers: async (api) => {
    try {
      // const loginStore = useLoginStoreState();
      const answer = get().answers;
      let answersArray: { answers: number[] };

      if (answer.length == 9) {
        answersArray = { answers: Array(9).fill(1) };

        const res = await api.post(
          "/mysteries/check-answer",
          {
            ...answersArray,
          },
          {
            headers: {
              "X-Game": process.env.NEXT_PUBLIC_GAME_NAME,
            },
          }
        );
        if (res.status == 200 || res.status == 201) {
          // await loginStore.getMe();

          return res;
        }
      }
      // handle response as needed
    } catch (err) {
      set({ error: "Failed to submit answers" });
    }
  },

  reset: () => {
    set({ answers: [...DEFAULT_ANSWERS], nextStep: 0 });
    saveAnswersToLocalStorage([...DEFAULT_ANSWERS]);
  },
}));
