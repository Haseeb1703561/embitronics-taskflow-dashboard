import { NextResponse } from "next/server";
import { ZodError } from "zod";

type ErrorDetails = Record<string, string[]> | string | null;

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
    },
    { status },
  );
}

export function errorResponse(
  message: string,
  status = 400,
  details: ErrorDetails = null,
) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        message,
        details,
      },
    },
    { status },
  );
}

export function mapZodError(error: ZodError) {
  return error.flatten().fieldErrors;
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return errorResponse("Please correct the highlighted fields.", 422, mapZodError(error));
  }

  if (error instanceof Error) {
    return errorResponse(error.message || "Something went wrong.", 500);
  }

  return errorResponse("Something went wrong.", 500);
}
