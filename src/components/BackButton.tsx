"use client";

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-white text-black p-2 rounded-full shadow-md z-30"
    >
      ← Back
    </button>
  );
}
