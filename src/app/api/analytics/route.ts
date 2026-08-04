import { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api/auth";
import { apiOk, apiError, apiUnauthorized } from "@/lib/api/response";
import { analyticsQuerySchema } from "@/lib/validation/analytics";
import { getAnalytics } from "@/lib/services/analytics";

export async function GET(request: NextRequest) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const { months, month } = analyticsQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const data = await getAnalytics(user.id, { months, endMonth: month });
    return apiOk(data);
  } catch (error) {
    return apiError(error);
  }
}
