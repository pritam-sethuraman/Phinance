// TODO(M2): export { GET, POST } from "@/lib/auth/auth" once Auth.js is configured.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { data: null, error: { message: "Auth not configured yet" } },
    { status: 501 },
  );
}
export const POST = GET;

// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";

// export const authOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     // ...add more providers here
//   ],
// };

// export default NextAuth(authOptions);
