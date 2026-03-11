import type { IProject } from "@/models/Project";
import type { ITask } from "@/models/Task";

export function serializeProject(
  project: IProject,
  extras?: { totalTasks?: number; completedTasks?: number },
) {
  return {
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    totalTasks: extras?.totalTasks ?? 0,
    completedTasks: extras?.completedTasks ?? 0,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export function serializeTask(task: ITask) {
  return {
    id: task._id.toString(),
    projectId: task.projectId.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
