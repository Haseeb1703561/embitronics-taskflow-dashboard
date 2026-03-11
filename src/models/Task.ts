import { Model, Schema, model, models, type Types } from "mongoose";

import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";

export interface ITask {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  status: (typeof TASK_STATUSES)[number];
  priority: (typeof TASK_PRIORITIES)[number];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "To Do",
      required: true,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "Medium",
      required: true,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ userId: 1, projectId: 1, status: 1, priority: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

const Task = (models.Task as Model<ITask>) || model<ITask>("Task", taskSchema);

export default Task;
