import { startOfDay } from "date-fns";

import { errorResponse, successResponse } from "@/lib/api";
import { TASK_STATUSES } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { serializeTask } from "@/lib/serializers";
import { requireSessionUser } from "@/lib/session";
import type { ITask } from "@/models/Task";
import Project from "@/models/Project";
import Task from "@/models/Task";

export async function GET() {
  const user = await requireSessionUser();

  if (!user) {
    return errorResponse("You must be logged in to view the dashboard.", 401);
  }

  await connectToDatabase();

  const [totalProjects, totalTasks, overdueTasks, statusCounts, recentTasks] =
    await Promise.all([
      Project.countDocuments({ userId: user.objectId }),
      Task.countDocuments({ userId: user.objectId }),
      Task.countDocuments({
        userId: user.objectId,
        dueDate: { $lt: startOfDay(new Date()) },
        status: { $ne: "Done" },
      }),
      Task.aggregate<{ _id: string; count: number }>([
        {
          $match: {
            userId: user.objectId,
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Task.find({ userId: user.objectId }).sort({ updatedAt: -1 }).limit(6).lean(),
    ]);

  const tasksByStatus = TASK_STATUSES.reduce<Record<(typeof TASK_STATUSES)[number], number>>(
    (accumulator, status) => {
      const match = statusCounts.find((item) => item._id === status);
      accumulator[status] = match?.count ?? 0;
      return accumulator;
    },
    {
      "To Do": 0,
      "In Progress": 0,
      "In Review": 0,
      Done: 0,
    },
  );

  return successResponse({
    totalProjects,
    totalTasks,
    overdueTasks,
    tasksByStatus,
    recentTasks: recentTasks.map((task) => serializeTask(task as unknown as ITask)),
  });
}
