import { Types } from "mongoose";

import { errorResponse, handleRouteError, successResponse } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { serializeProject } from "@/lib/serializers";
import { requireSessionUser } from "@/lib/session";
import { createProjectSchema } from "@/lib/validations/project";
import type { IProject } from "@/models/Project";
import Project from "@/models/Project";
import Task from "@/models/Task";

export async function GET() {
  const user = await requireSessionUser();

  if (!user) {
    return errorResponse("You must be logged in to view projects.", 401);
  }

  await connectToDatabase();

  const [projects, taskCounts] = await Promise.all([
    Project.find({ userId: user.objectId }).sort({ updatedAt: -1 }).lean(),
    Task.aggregate<{
      _id: Types.ObjectId;
      totalTasks: number;
      completedTasks: number;
    }>([
      {
        $match: {
          userId: user.objectId,
        },
      },
      {
        $group: {
          _id: "$projectId",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "Done"] }, 1, 0],
            },
          },
        },
      },
    ]),
  ]);

  const countMap = new Map(
    taskCounts.map((item) => [
      item._id.toString(),
      {
        totalTasks: item.totalTasks,
        completedTasks: item.completedTasks,
      },
    ]),
  );

  return successResponse(
    projects.map((project) =>
      serializeProject(project as unknown as IProject, countMap.get(project._id.toString())),
    ),
  );
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();

    if (!user) {
      return errorResponse("You must be logged in to create a project.", 401);
    }

    const body = await request.json();
    const payload = createProjectSchema.parse(body);

    await connectToDatabase();

    const project = await Project.create({
      userId: user.objectId,
      name: payload.name,
      description: payload.description,
    });

    return successResponse(serializeProject(project.toObject() as IProject), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
