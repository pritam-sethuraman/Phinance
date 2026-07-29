/**
 * Upstash-backed rate limiter — real implementation lands in M10.
 * Exported now so route handlers can import a stable shape from day one.
 */
export async function checkRateLimit(
  _key: string,
): Promise<{ success: boolean }> {
  // No-op until M10: always allow.
  return { success: true };
}
