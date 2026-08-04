import { cache } from "react";
import { requireUser as requireSessionUser } from "@/lib/auth/session";
import { getUser } from "@/lib/services/user";

/**
 * session.user only carries id/role (see src/lib/auth/auth.config.ts) —
 * deliberately, so preference changes apply immediately rather than
 * requiring re-login to refresh a stale JWT claim. Anything that needs
 * currency/locale/theme/name/image fetches the live row instead.
 *
 * Wrapped in React's cache() so multiple calls within the same request
 * (e.g. from a layout AND a page AND a nested component) dedupe to a
 * single query rather than hitting the DB repeatedly.
 */
export const getCurrentUserPrefs = cache(async () => {
  const sessionUser = await requireSessionUser();
  return getUser(sessionUser.id);
});
