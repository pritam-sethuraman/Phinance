import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

/** Standard {data, error, meta} envelope (docs/02-TECHNICAL-ARCHITECTURE.md §4). */
export function apiOk<T>(
  data: T,
  init?: { status?: number; meta?: Record<string, unknown> },
) {
  return NextResponse.json(
    { data, error: null, ...(init?.meta ? { meta: init.meta } : {}) },
    { status: init?.status ?? 200 },
  );
}

export function apiUnauthorized() {
  return NextResponse.json(
    { data: null, error: { message: "Unauthorized" } },
    { status: 401 },
  );
}

/** Maps a thrown error to the right status code + envelope. Route handlers funnel every catch through this. */
export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        data: null,
        error: {
          message: "Validation failed",
          fields: error.flatten().fieldErrors,
        },
      },
      { status: 422 },
    );
  }
  if (error instanceof NotFoundError) {
    return NextResponse.json(
      { data: null, error: { message: error.message } },
      { status: 404 },
    );
  }
  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      { data: null, error: { message: error.message } },
      { status: 403 },
    );
  }

  console.error(error);
  return NextResponse.json(
    { data: null, error: { message: "Internal server error" } },
    { status: 500 },
  );
}
