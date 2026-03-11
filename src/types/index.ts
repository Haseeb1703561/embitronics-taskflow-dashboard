import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type ApiSuccess<T> = {
  success: true;
  data: T;
  error: null;
};

export type ApiFailure = {
  success: false;
  data: null;
  error: {
    message: string;
    details?: Record<string, string[]> | string | null;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type ProjectSummary = {
  id: string;
  name: string;
  description?: string;
  totalTasks: number;
  completedTasks: number;
  createdAt: string;
  updatedAt: string;
};

export type TaskItem = {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totalProjects: number;
  totalTasks: number;
  overdueTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  recentTasks: TaskItem[];
};
