"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useApi } from "@/context/api";
import { useLoginStoreState } from "@/stores/context";
import { FaCheck, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";

interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  locked: boolean;
}

const TasksPage = () => {
  const t = useTranslations();
  const { api } = useApi();
  const { userData } = useLoginStoreState();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/mainuser/tasks");
        if (response.status === 200) {
          setTasks(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // If API fails, show empty state instead of crashing
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [api]);

  const handleTaskComplete = async (taskId: number) => {
    try {
      const response = await api.post(`/mainuser/tasks/${taskId}/complete`);
      if (response.status === 200) {
        // Update the task as completed
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        ));
      }
    } catch (error) {
      console.error("Error completing task:", error);
      // Show user-friendly error message
      toast.error("Failed to complete task. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-[#7D7D7D]/30 backdrop-blur-md border border-[#C643A8E5] rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          {t("Tasks")}
        </h1>
        
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border ${
                  task.completed 
                    ? "bg-green-500/20 border-green-500" 
                    : task.locked 
                    ? "bg-gray-500/20 border-gray-500" 
                    : "bg-white/10 border-[#FF4ED3]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">{task.title}</h3>
                    <p className="text-gray-300 text-sm mb-2">{task.description}</p>
                    <p className="text-[#FF4ED3] font-bold">{task.reward} EX9630</p>
                  </div>
                  
                  <div className="ml-4">
                    {task.completed ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <FaCheck className="text-white text-sm" />
                      </div>
                    ) : task.locked ? (
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        <FaLock className="text-white text-sm" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className="w-8 h-8 bg-[#FF4ED3] rounded-full flex items-center justify-center hover:bg-[#FF4ED3]/80 transition-colors"
                      >
                        <FaCheck className="text-white text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white py-8">
              <p>{t("No tasks available at the moment")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;