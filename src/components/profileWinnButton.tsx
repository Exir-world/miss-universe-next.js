// components/ClaimRewardButton.js
"use client";

export default function ClaimRewardButton({ onClick, isWinner, label }) {
  if (!isWinner) return null;

  return (
    <div className="pt-4 w-full flex justify-center">
      <button
        onClick={onClick}
        className="relative overflow-hidden text-white font-semibold py-2 px-6 flex items-center  rounded-full mb-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-[length:300%_100%] animate-shimmer shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300 w-full gap-2"
      >
        <span className="relative z-10 flex items-center justify-center gap-2 text-gray-800 capitalize">
          {label}
        </span>

        <span>💰</span>
      </button>
    </div>
  );
}
