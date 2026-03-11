import { Types } from "mongoose";

import { getAuthSession } from "@/lib/auth";

export async function requireSessionUser() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    objectId: new Types.ObjectId(session.user.id),
    email: session.user.email ?? "",
  };
}
