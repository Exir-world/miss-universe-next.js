import React from "react";

type AnswerItemProps = {
  text?: string;
};

const AnswerItem = ({ text = "test" }: AnswerItemProps) => {
  return (
    <button
      type="button"
      className="border border-[#C643A8E5] rounded-[15px]  bg-[#242424] flex items-center justify-center text-center px-2 py-3 text-white text-[16px] font-[500] w-full"
    >
      {text}
    </button>
  );
};

export default AnswerItem;
