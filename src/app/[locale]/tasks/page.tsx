"use client";
import React, { useEffect, useState } from "react";
import { FaCheckSquare, FaClock, FaUsers, FaTasks } from "react-icons/fa";
import { MdTask } from "react-icons/md";
import { TaskCard } from "@/components/taskCard";
import { TaskModal } from "@/components/taskModal";
import { TaskSkeleton } from "@/components/taskSkeleton";
import { useTaskStore } from "@/stores/tasks";
import { useTranslations } from "next-intl";

const TasksPage: React.FC = () => {
  const {
    loading,
    error,
    fetchTasks,
    doTask,
    hugTask,
    getToDoTasks,
    getDoneTasks,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const todoTasks = getToDoTasks();
  const doneTasks = getDoneTasks();

  const t = useTranslations();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDoTask = (taskId: number, url: string) => {
    doTask(taskId);

    // Open external link (simulating Telegram WebApp behavior)
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleTaskDone = (taskId: number, userName: string) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
    handleHugTask(userName, taskId.toString());
  };

  const handleHugTask = async (userName: string, taskId: string) => {
    if (!userName.trim()) {
      return;
    }

    try {
      await hugTask(userName, taskId);
      setIsComplete(true);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <FaTasks className="size-3 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              {t("tasks.center")}
            </h1>
          </div>
          <p className="text-gray-300">{t("tasks.completeToEarn")}</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}

        {/* Daily Tasks Section */}
        <div className="mb-8">
          <h2 className="text-white text-sm  mb-4 flex items-center">
            <MdTask className="w-6 h-6 mr-2 text-purple-400" />
            {t("tasks.activeTasks")} ({todoTasks.length})
          </h2>

          <div className="space-y-4">
            {loading && todoTasks.length === 0
              ? // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <TaskSkeleton key={`loading-${index}`} />
                ))
              : // Actual tasks
                todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDoTask={handleDoTask}
                    onTaskDone={handleTaskDone}
                    loading={loading}
                  />
                ))}

            {!loading && todoTasks.length === 0 && (
              <div className="text-center py-12">
                <FaClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {t("tasks.noActiveTasks")}
                </p>
                <p className="text-gray-500 text-sm">
                  {t("tasks.checkBackLater")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Tasks Section */}
        <div>
          <h2 className="text-white text-md font-semibold mb-4 flex items-center">
            <FaCheckSquare className="w-6 h-6 mr-2 text-green-400" />
            {t("tasks.completeTask")} ({doneTasks.length})
          </h2>

          <div className="space-y-4">
            {loading && doneTasks.length === 0
              ? // Loading skeletons
                Array.from({ length: 2 }).map((_, index) => (
                  <TaskSkeleton key={`loading-done-${index}`} />
                ))
              : // Completed tasks
                doneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} loading={loading} />
                ))}

            {!loading && doneTasks.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCheckSquare className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-400">{t("tasks.noCompletedTasks")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Completion Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={(userName) =>
            selectedTaskId && handleHugTask(userName, selectedTaskId.toString())
          }
          loading={loading}
          isComplete={isComplete}
        />
      </div>
    </div>
  );
};

export default TasksPage;
