import { NextResponse } from "next/server";

// TODO: implemented in a later module — see docs/07-CLAUDE-CODE-PROMPTS.md.
export async function GET() {
  return NextResponse.json(
    { data: null, error: { message: "Not implemented yet" } },
    { status: 501 },
  );
}
