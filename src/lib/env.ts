import { z } from "zod";

/**
 * Fail-fast, Zod-validated environment variables.
 *
 * Every var the app depends on is declared here. Add a var to `.env.example`
 * AND to the right schema below whenever a module introduces new config —
 * never read `process.env.X` directly elsewhere in the app.
 *
 * Vars are grouped by when a module needs them so early modules (M0/M1)
 * aren't forced to fill in secrets (Resend, Upstash, storage) they don't
 * use yet. Each group is `optional()` until its module lands, at which
 * point tighten it to `required` in that module's PR.
 */
const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Auth.js — required from M2
  NEXTAUTH_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Database — required from M1
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),

  // Rate limiting — required from M10
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Email — V1.1
  RESEND_API_KEY: z.string().optional(),

  // Storage — V1.1
  STORAGE_PROVIDER: z.enum(["supabase", "cloudinary"]).optional(),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_KEY: z.string().optional(),
  STORAGE_SECRET: z.string().optional(),
});

type ServerEnv = z.infer<typeof serverSchema>;

function loadEnv(): ServerEnv {
  const parsed = serverSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables — see console for details.");
  }

  return parsed.data;
}

export const env = loadEnv();
