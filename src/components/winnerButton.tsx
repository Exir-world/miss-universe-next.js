import React from "react";

const WinnerButton = () => {
  return (
    <button
      onClick={() => console.log("hey")}
      type="button"
      className="w-full border border-[#FF4ED3] rounded-xl text-center justify-center p-2 text-white "
    >
      You won ! 🎉
    </button>
  );
};

export default WinnerButton;
