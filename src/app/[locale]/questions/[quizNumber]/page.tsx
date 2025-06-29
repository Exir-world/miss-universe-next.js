"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const page = () => {
  const params = useParams();
  const t = useTranslations();
  const quizNumber = params.quizNumber;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-8">
          Quiz #{quizNumber}
        </h1>
        <p className="text-white">
          This quiz page is under development.
        </p>
      </div>
    </div>
  );
};

export default page;
