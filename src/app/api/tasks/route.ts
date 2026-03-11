import { Types } from "mongoose";

import { errorResponse, handleRouteError, successResponse } from "@/lib/api";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { serializeTask } from "@/lib/serializers";
import { requireSessionUser } from "@/lib/session";
import { createTaskSchema } from "@/lib/validations/task";
import type { ITask } from "@/models/Task";
import Project from "@/models/Project";
import Task from "@/models/Task";

export async function GET(request: Request) {
  const user = await requireSessionUser();

  if (!user) {
    return errorResponse("You must be logged in to view tasks.", 401);
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  if (projectId && !Types.ObjectId.isValid(projectId)) {
    return errorResponse("Invalid project identifier.", 400);
  }

  if (status && !TASK_STATUSES.includes(status as (typeof TASK_STATUSES)[number])) {
    return errorResponse("Invalid task status filter.", 400);
  }

  if (
    priority &&
    !TASK_PRIORITIES.includes(priority as (typeof TASK_PRIORITIES)[number])
  ) {
    return errorResponse("Invalid task priority filter.", 400);
  }

  await connectToDatabase();

  const query: Record<string, unknown> = {
    userId: user.objectId,
  };

  if (projectId) {
    query.projectId = new Types.ObjectId(projectId);
  }

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  const tasks = await Task.find(query)
    .sort({ dueDate: 1, createdAt: -1 })
    .lean();

  return successResponse(
    tasks.map((task) => serializeTask(task as unknown as ITask)),
  );
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();

    if (!user) {
      return errorResponse("You must be logged in to create a task.", 401);
    }

    const body = await request.json();
    const payload = createTaskSchema.parse(body);

    if (!Types.ObjectId.isValid(payload.projectId)) {
      return errorResponse("Invalid project identifier.", 400);
    }

    await connectToDatabase();

    const project = await Project.findOne({
      _id: payload.projectId,
      userId: user.objectId,
    }).lean();

    if (!project) {
      return errorResponse("Project not found.", 404);
    }

    const task = await Task.create({
      userId: user.objectId,
      projectId: new Types.ObjectId(payload.projectId),
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    });

    return successResponse(serializeTask(task.toObject() as ITask), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
