import { Model, Schema, model, models, type Types } from "mongoose";

export interface IProject {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ userId: 1, updatedAt: -1 });

const Project =
  (models.Project as Model<IProject>) || model<IProject>("Project", projectSchema);

export default Project;
