// components/ClaimRewardButton.js
"use client";

export default function ClaimRewardButton({ onClick, isWinner, label }) {
  if (!isWinner) return null;

  return (
    <div className="pt-2 w-full flex justify-center">
      <button
        onClick={onClick}
        className="relative overflow-hidden text-white font-semibold py-3 px-6 rounded-full mb-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-[length:300%_100%] animate-shimmer shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300 w-full"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          💰 {label}
        </span>

        <span className="absolute inset-0 bg-white/5 rounded-full pointer-events-none"></span>
      </button>
    </div>
  );
}
