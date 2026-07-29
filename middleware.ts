import { withAuth } from "next-auth/middleware";

export default withAuth;

export const config = {
  matcher: ["/admin/*", "/(app)/*"],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Replace with your actual auth session/token getter (e.g., NextAuth, Supabase, Jose, custom JWT)
// async function getSession(request: NextRequest) {
//   const token = request.cookies.get("auth-token")?.value;
//   if (!token) return null;

//   // Perform token verification / payload decoding here
//   // Returning mock session shape for demonstration:
//   return {
//     user: {
//       role: token === "admin-token" ? "ADMIN" : "USER",
//     },
//   };
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const session = await getSession(request);

//   // ---------------------------------------------------------------------------
//   // 1. Route Protection & Authorization
//   // ---------------------------------------------------------------------------
//   const isAppRoute = pathname.startsWith("/app");
//   const isAdminRoute = pathname.startsWith("/admin");

//   if (isAppRoute || isAdminRoute) {
//     // Redirect unauthenticated users to /login
//     if (!session) {
//       const loginUrl = new URL("/login", request.url);
//       // Optional: Store the original path to redirect back post-login
//       loginUrl.searchParams.set("from", pathname);
//       return NextResponse.redirect(loginUrl);
//     }

//     // Gate /admin routes for ADMIN role only
//     if (isAdminRoute && session.user.role !== "ADMIN") {
//       // Redirect unauthorized users to an unauthenticated/forbidden page
//       return NextResponse.redirect(new URL("/app", request.url));
//     }
//   }

//   // ---------------------------------------------------------------------------
//   // 2. Security Headers
//   // ---------------------------------------------------------------------------
//   const response = NextResponse.next();

//   // Content Security Policy (Adjust script-src / style-src according to your needs)
//   const cspHeader = `
//     default-src 'self';
//     script-src 'self' 'unsafe-eval' 'unsafe-inline';
//     style-src 'self' 'unsafe-inline';
//     img-src 'self' blob: data:;
//     font-src 'self';
//     object-src 'none';
//     base-uri 'self';
//     form-action 'self';
//     frame-ancestors 'none';
//     upgrade-insecure-requests;
//   `
//     .replace(/\s{2,}/g, " ")
//     .trim();

//   response.headers.set("Content-Security-Policy", cspHeader);

//   // Prevent clickjacking
//   response.headers.set("X-Frame-Options", "DENY");

//   // Prevent MIME type sniffing
//   response.headers.set("X-Content-Type-Options", "nosniff");

//   // Control referrer information sent in HTTP headers
//   response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

//   // Force HTTPS for 1 year including subdomains
//   response.headers.set(
//     "Strict-Transport-Security",
//     "max-age=31536000; includeSubDomains; preload",
//   );

//   return response;
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
