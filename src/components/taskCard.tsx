import React, { useState } from "react";
import {
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaTiktok,
  FaGlobe,
  FaExternalLinkAlt,
  FaCoins,
  FaClock,
} from "react-icons/fa";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";

import { SiThreads } from "react-icons/si";

interface Task {
  id: number;
  title: string;
  name: string;
  completed: boolean;
  createdAt: string;
  isPending: boolean;
  type: string;
  content?: string;
  game?: string;
  locale?: string;
  needAuth: boolean;
  reward: number;
  status: string;
  coinRewardId: number;
}

enum TaskTypeEnum {
  YoutubeWatch = "youtube.watch",
  YoutubeSubscribe = "youtube.subscribe",
  WhatsappJoin = "whatsapp.join",
  InstagramFollow = "instagram.follow",
  FacebookFollow = "facebook.follow",
  XFollow = "x.follow",
  TiktokFollow = "tiktok.follow",
  TelegramJoin = "telegram.join",
  LinkedinFollow = "linkedin.follow",
  ThreadsFollow = "threads.follow",
  WebsiteVisit = "website.visit",
}

interface TaskCardProps {
  task: Task;
  onDoTask?: (taskId: number, url: string) => void;
  onTaskDone?: (taskId: number, userName: string) => void;
  loading?: boolean;
}

const getTaskIcon = (type: string) => {
  const iconClass = "w-6 h-6 text-white";

  switch (type) {
    case TaskTypeEnum.YoutubeWatch:
    case TaskTypeEnum.YoutubeSubscribe:
      return <FaYoutube className={iconClass} />;
    case TaskTypeEnum.InstagramFollow:
      return <FaInstagram className={iconClass} />;
    case TaskTypeEnum.WhatsappJoin:
      return <FaWhatsapp className={iconClass} />;
    case TaskTypeEnum.TelegramJoin:
      return <FaTelegram className={iconClass} />;
    case TaskTypeEnum.XFollow:
      return <FaTwitter className={iconClass} />;
    case TaskTypeEnum.TiktokFollow:
      return <FaTiktok className={iconClass} />;
    case TaskTypeEnum.LinkedinFollow:
      return <FaLinkedin className={iconClass} />;
    case TaskTypeEnum.FacebookFollow:
      return <FaFacebook className={iconClass} />;
    case TaskTypeEnum.ThreadsFollow:
      return <SiThreads className={iconClass} />;
    case TaskTypeEnum.WebsiteVisit:
      return <FaGlobe className={iconClass} />;
    default:
      return <FaExternalLinkAlt className={iconClass} />;
  }
};

const getActionLabel = (type: string) => {
  switch (type) {
    case TaskTypeEnum.YoutubeWatch:
      return "Watch";
    case TaskTypeEnum.YoutubeSubscribe:
      return "Subscribe";
    case TaskTypeEnum.WhatsappJoin:
    case TaskTypeEnum.TelegramJoin:
      return "Join";
    case TaskTypeEnum.InstagramFollow:
    case TaskTypeEnum.FacebookFollow:
    case TaskTypeEnum.XFollow:
    case TaskTypeEnum.TiktokFollow:
    case TaskTypeEnum.LinkedinFollow:
    case TaskTypeEnum.ThreadsFollow:
      return "Follow";
    case TaskTypeEnum.WebsiteVisit:
      return "Visit";
    default:
      return "Do Task";
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDoTask,
  onTaskDone,
  loading = false,
}) => {
  const [userName, setUserName] = useState("");

  const handleDoWork = () => {
    if (task.content && onDoTask) {
      onDoTask(task.id, task.content);
    }
  };

  const handleTaskDone = () => {
    if (onTaskDone && userName.trim()) {
      onTaskDone(task.id, userName.trim());
      setUserName("");
    }
  };

  const actionLabel = getActionLabel(task.type);

  return (
    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:bg-white/25 transition-all duration-300">
      <div className="flex w-full items-center justify-center gap-3">
        <div className="flex gap-2 flex-col w-2/3">
          <div className="flex text-white justify-start items-center gap-2 ">
            <div className="flex-shrink-0 ">{getTaskIcon(task.type)}</div>
            <span className="leading-6 text-sm font-medium break-words w-full block overflow-hidden text-ellipsis whitespace-pre-line max-w-full">
              {task.name}
            </span>
          </div>
          {!task.isPending && !task.completed && (
            <div className="flex items-center gap-1 text-gray-300">
              <FaCoins className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">{task.reward} EX9630</span>
            </div>
          )}
        </div>

        <div className="w-1/3 flex justify-center">
          {task.completed ? (
            <div className="flex justify-center items-center size-8 bg-green-500 rounded-full">
              <TbRosetteDiscountCheckFilled className="size-6 text-white" />
            </div>
          ) : task.isPending ? (
            <div className="flex justify-center items-center py-1 px-1.5 bg-purple-500/60 text-white rounded-full text-xs font-medium max-w-[96px]">
              <FaClock className="w-3 h-3 mx-1" />
              Pending
            </div>
          ) : (
            <button
              onClick={handleDoWork}
              disabled={loading}
              className="flex justify-center items-center py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-medium text-xs transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 max-w-[96px]"
              style={{
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                actionLabel
              )}
            </button>
          )}
        </div>
      </div>

      {/* Username input for pending tasks */}
      {task.isPending && !task.completed && (
        <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between gap-2 w-full">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              className="w-2/3 px-2 py-1 bg-gray-700/50 border border-pink-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
            <div className="w-1/4 flex items-center justify-center">
              <button
                onClick={handleTaskDone}
                disabled={loading || !userName.trim()}
                className="text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 py-1.5 px-5 rounded-full font-medium text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed max-w-[96px]"
                style={{
                  boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)",
                }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto " />
                ) : (
                  "Claim"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
