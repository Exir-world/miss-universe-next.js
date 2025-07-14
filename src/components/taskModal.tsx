import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTranslations } from "next-intl";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userName: string) => void;
  loading: boolean;
  isComplete: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  isComplete,
}) => {
  const [userName, setUserName] = useState("");
  const t = useTranslations();

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setUserName("");
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onClose]);

  const handleSubmit = () => {
    if (userName.trim()) {
      onSubmit(userName.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md mx-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t("taskModal.completeTask")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="transition-all duration-500">
            {isComplete ? (
              <FaCheckCircle className="w-24 h-24 text-green-400 animate-pulse" />
            ) : loading ? (
              <AiOutlineLoading3Quarters className="w-24 h-24 text-purple-400 animate-spin" />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">?</span>
              </div>
            )}
          </div>

          {!isComplete && (
            <>
              <p className="text-gray-300 text-center">
                {t("taskModal.enterUsernameToComplete")}
              </p>

              {/* <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("taskModal.yourUsername")}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                disabled={loading}
                autoFocus
              /> */}

              <button
                onClick={handleSubmit}
                disabled={loading || !userName.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
                    {t("global.processing")}
                  </div>
                ) : (
                  t("taskModal.completeTask")
                )}
              </button>
            </>
          )}

          {isComplete && (
            <p className="text-green-400 text-center font-medium">
              {t("taskModal.complete")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
