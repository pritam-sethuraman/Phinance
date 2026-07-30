import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

/**
 * Split from `auth.ts` deliberately: middleware.ts runs on the Edge
 * runtime, which can't load the Prisma adapter (needs Node's `net`/`tls`)
 * or argon2 (native binary). This file only contains what's safe there —
 * OAuth provider metadata, session strategy, and JWT/session shape. The
 * Credentials provider (with its `authorize` callback) is added in
 * auth.ts, which runs in the Node runtime everywhere else (route handlers,
 * server components, server actions).
 *
 * OAuth providers are included conditionally so the app still boots for
 * contributors who haven't set up Google/GitHub OAuth apps yet — signing in
 * with an unconfigured provider fails with a clear Auth.js error rather
 * than the whole app failing to start.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
