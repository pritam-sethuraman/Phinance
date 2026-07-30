// import { NextAuthOptions } from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
// };

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import argon2 from "argon2";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/auth";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        // No user, or an OAuth-only account with no password set.
        if (!user?.passwordHash) return null;

        const valid = await argon2.verify(
          user.passwordHash,
          parsed.data.password,
        );
        if (!valid) return null;

        // Return a minimal shape — this becomes the `user` param the jwt
        // callback sees for this one request. We never want passwordHash
        // (or any other Prisma field) accidentally flowing further than that.
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
});
