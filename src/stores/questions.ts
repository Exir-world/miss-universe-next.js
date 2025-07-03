import { useRouter } from "@/i18n/navigation";
import { create } from "zustand";

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

const ANSWERS_KEY = "answersSubmit";
const DEFAULT_ANSWERS = Array(9).fill(-1);

function saveAnswersToLocalStorage(answers: number[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  }
}

function loadAnswersFromLocalStorage(): number[] {
  if (typeof window === "undefined") return [...DEFAULT_ANSWERS];
  const stored = localStorage.getItem(ANSWERS_KEY);
  return stored ? JSON.parse(stored) : [...DEFAULT_ANSWERS];
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
      const res = await api.get(
        `questions/active?game=${process.env.NEXT_PUBLIC_GAME_NAME}`
      );
      if (res.status === 200) {
        const sortedQuestions = res.data.data
          .slice()
          .sort((a: Question, b: Question) => a.order - b.order);
        set({ questions: sortedQuestions, loading: false });
      } else {
        set({ error: "Failed to fetch questions", loading: false });
      }
    } catch (err) {
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
    // const router = useRouter();
    try {
      const answers = get().answers;
      console.log(answers, "from store");

      const res = await api.post("/mysteries/check-answer", {
        answers,
      });
      if (res.status == 200 || res.status == 201) {
        // router.push("/");
        return res.data;
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
