import { Types } from "mongoose";

import { errorResponse, handleRouteError, successResponse } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { serializeProject } from "@/lib/serializers";
import { requireSessionUser } from "@/lib/session";
import { updateProjectSchema } from "@/lib/validations/project";
import type { IProject } from "@/models/Project";
import Project from "@/models/Project";
import Task from "@/models/Task";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();

    if (!user) {
      return errorResponse("You must be logged in to update a project.", 401);
    }

    const { projectId } = await context.params;

    if (!Types.ObjectId.isValid(projectId)) {
      return errorResponse("Invalid project identifier.", 400);
    }

    const body = await request.json();
    const payload = updateProjectSchema.parse(body);

    await connectToDatabase();

    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId: user.objectId,
      },
      payload,
      {
        new: true,
      },
    ).lean();

    if (!project) {
      return errorResponse("Project not found.", 404);
    }

    return successResponse(serializeProject(project as unknown as IProject));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();

    if (!user) {
      return errorResponse("You must be logged in to delete a project.", 401);
    }

    const { projectId } = await context.params;

    if (!Types.ObjectId.isValid(projectId)) {
      return errorResponse("Invalid project identifier.", 400);
    }

    await connectToDatabase();

    const project = await Project.findOneAndDelete({
      _id: projectId,
      userId: user.objectId,
    }).lean();

    if (!project) {
      return errorResponse("Project not found.", 404);
    }

    await Task.deleteMany({
      projectId: new Types.ObjectId(projectId),
      userId: user.objectId,
    });

    return successResponse({
      id: projectId,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
