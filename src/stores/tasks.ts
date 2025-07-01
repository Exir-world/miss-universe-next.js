import { create } from "zustand";

import { createAxiosInstance } from "@/lib/axiosInstance";

export interface Task {
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

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const api = createAxiosInstance("en");

const loadPendingTasksFromLocalStorage = (): number[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const saved = localStorage.getItem("pendingTasks");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading pending tasks:", error);
    return [];
  }
};

const savePendingTasksToLocalStorage = (taskIds: number[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("pendingTasks", JSON.stringify(taskIds));
  }
};

interface TaskStore extends TaskState {
  // Computed getters
  getTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getPendingTasks: () => Task[];
  getToDoTasks: () => Task[];
  getDoneTasks: () => Task[];

  // Actions
  fetchTasks: () => Promise<void>;
  addPendingTask: (taskId: number) => void;
  doTask: (taskId: number) => void;
  completeTask: (taskId: number) => void;
  hugTask: (userName: string, taskId: string) => Promise<void>;

  // Internal state for pending tasks
  pendingTaskIds: number[];
  setPendingTaskIds: (ids: number[]) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  loading: false,
  error: null,
  pendingTaskIds: loadPendingTasksFromLocalStorage(),

  // Computed getters
  getTasks: () => get().tasks,
  getCompletedTasks: () => get().tasks.filter((t) => t.completed),
  getPendingTasks: () => get().tasks.filter((t) => t.isPending),
  getToDoTasks: () => get().tasks.filter((task) => !task.completed),
  getDoneTasks: () => get().tasks.filter((task) => task.completed),

  // Actions
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/mainuser/tasks");
      const pendingTaskIds = get().pendingTaskIds;

      const tasks = data.data.map(
        (task: any): Task => ({
          ...task,
          completed: task.status === "Done",
          isPending: pendingTaskIds.includes(task.id),
        })
      );

      set({ tasks, loading: false });
      console.log("Tasks loaded:", tasks);
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      set({ error, loading: false });
    }
  },

  addPendingTask: (taskId: number) => {
    const currentPendingIds = get().pendingTaskIds;
    if (!currentPendingIds.includes(taskId)) {
      const newPendingIds = [...currentPendingIds, taskId];
      set({ pendingTaskIds: newPendingIds });
      savePendingTasksToLocalStorage(newPendingIds);
    }
  },

  doTask: (taskId: number) => {
    const { addPendingTask } = get();
    addPendingTask(taskId);

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, isPending: true } : task
      ),
    }));
  },

  completeTask: (taskId: number) => {
    console.log("Completing task:", taskId);

    set((state) => {
      const newPendingIds = state.pendingTaskIds.filter((id) => id !== taskId);
      savePendingTasksToLocalStorage(newPendingIds);

      return {
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? { ...task, completed: true, isPending: false, status: "Done" }
            : task
        ),
        pendingTaskIds: newPendingIds,
      };
    });

    console.log("Task completed:", taskId);
  },

  hugTask: async (userName: string, taskId: string) => {
    if (!userName) {
      return;
    }

    set({ loading: true, error: null });
    try {
      await api.post("/mainuser/tasks/done", { taskId, content: userName });
      get().completeTask(parseInt(taskId));
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  setPendingTaskIds: (ids: number[]) => {
    set({ pendingTaskIds: ids });
    savePendingTasksToLocalStorage(ids);
  },
}));
