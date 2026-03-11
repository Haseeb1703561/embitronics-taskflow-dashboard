import bcrypt from "bcryptjs";

import { errorResponse, handleRouteError, successResponse } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = registerSchema.parse(body);

    await connectToDatabase();

    const existingUser = await User.findOne({ email: payload.email }).lean();

    if (existingUser) {
      return errorResponse("An account with this email already exists.", 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);

    const user = await User.create({
      email: payload.email,
      passwordHash,
    });

    return successResponse(
      {
        id: user._id.toString(),
        email: user.email,
      },
      201,
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
