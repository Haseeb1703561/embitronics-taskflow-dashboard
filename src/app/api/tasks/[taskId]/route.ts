import { Types } from "mongoose";

import { errorResponse, handleRouteError, successResponse } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { serializeTask } from "@/lib/serializers";
import { requireSessionUser } from "@/lib/session";
import { updateTaskSchema } from "@/lib/validations/task";
import type { ITask } from "@/models/Task";
import Task from "@/models/Task";

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();

    if (!user) {
      return errorResponse("You must be logged in to update a task.", 401);
    }

    const { taskId } = await context.params;

    if (!Types.ObjectId.isValid(taskId)) {
      return errorResponse("Invalid task identifier.", 400);
    }

    const body = await request.json();
    const payload = updateTaskSchema.parse(body);

    await connectToDatabase();

    const task = await Task.findOne({
      _id: taskId,
      userId: user.objectId,
    });

    if (!task) {
      return errorResponse("Task not found.", 404);
    }

    if (payload.title !== undefined) {
      task.title = payload.title;
    }

    if (payload.description !== undefined) {
      task.description = payload.description;
    }

    if (payload.status !== undefined) {
      task.status = payload.status;
    }

    if (payload.priority !== undefined) {
      task.priority = payload.priority;
    }

    if (Object.prototype.hasOwnProperty.call(body, "dueDate")) {
      task.dueDate = payload.dueDate ? new Date(payload.dueDate) : undefined;
    }

    await task.save();

    return successResponse(serializeTask(task.toObject() as ITask));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();

    if (!user) {
      return errorResponse("You must be logged in to delete a task.", 401);
    }

    const { taskId } = await context.params;

    if (!Types.ObjectId.isValid(taskId)) {
      return errorResponse("Invalid task identifier.", 400);
    }

    await connectToDatabase();

    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId: user.objectId,
    }).lean();

    if (!task) {
      return errorResponse("Task not found.", 404);
    }

    return successResponse({ id: taskId });
  } catch (error) {
    return handleRouteError(error);
  }
}
