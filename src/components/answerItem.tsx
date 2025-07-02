import React from "react";

type AnswerItemProps = {
  text?: string;
  onClick?: () => void;
  state?: "default" | "correct" | "incorrect";
};

const AnswerItem = ({ text = "test", onClick, state = "default" }: AnswerItemProps) => {
  let bgClass = "bg-[#242424]";
  if (state === "correct") {
    bgClass = "bg-gradient-to-r from-green-500 to-green-800";
  } else if (state === "incorrect") {
    bgClass = "bg-gradient-to-r from-red-600 to-red-900 animate-shake";
  }
  return (
    <button
      onClick={onClick}
      type="button"
      className={`border border-[#C643A8E5] rounded-[15px] flex items-center justify-center text-center px-2 py-3 text-white text-[16px] font-[500] w-full ${bgClass}`}
    >
      {text}
    </button>
  );
};

export default AnswerItem;

// Add shake animation
// In your global CSS (e.g., src/app/globals.css), add:
// @keyframes shake { 0%,100%{transform:translateX(0);} 10%,70%{transform:translateX(-5px);} 20%,80%{transform:translateX(5px);} }
// .animate-shake { animation: shake 0.3s ease-in-out; }
