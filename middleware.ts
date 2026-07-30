// import { NextResponse } from "next/server";
// import { withAuth } from "next-auth/middleware";

// export default withAuth(
//   function middleware(req) {
//     const { pathname } = req.nextUrl;
//     const token = req.nextauth.token;

//     // Admin authorization
//     if (pathname.startsWith("/admin")) {
//       if (token?.role !== "ADMIN") {
//         return new NextResponse("Forbidden", { status: 403 });
//       }
//     }

//     const response = NextResponse.next();

//     // Security Headers
//     response.headers.set(
//       "Content-Security-Policy",
//       [
//         "default-src 'self'",
//         "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
//         "style-src 'self' 'unsafe-inline'",
//         "img-src 'self' data: https:",
//         "font-src 'self' data:",
//         "connect-src 'self' https:",
//         "object-src 'none'",
//         "base-uri 'self'",
//         "frame-ancestors 'none'",
//       ].join("; "),
//     );

//     response.headers.set(
//       "Strict-Transport-Security",
//       "max-age=31536000; includeSubDomains; preload",
//     );

//     response.headers.set("X-Frame-Options", "DENY");
//     response.headers.set("X-Content-Type-Options", "nosniff");
//     response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

//     return response;
//   },
//   {
//     callbacks: {
//       // Redirect anonymous users to /login
//       authorized: ({ token }) => !!token,
//     },
//     pages: {
//       signIn: "/login",
//     },
//   },
// );

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/transactions/:path*",
//     "/budgets/:path*",
//     "/settings/:path*",
//     "/profile/:path*",
//     "/admin/:path*",
//   ],
// };

// ============================================================================

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/transactions",
  "/budgets",
  "/analytics",
  "/settings",
  "/profile",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAdminRoute = pathname.startsWith("/admin");

  if ((isProtected || isAdminRoute) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  const res = NextResponse.next();

  // Security headers (docs/02-TECHNICAL-ARCHITECTURE.md §7). CSP is kept
  // reasonably tight for now; M10 tunes it further as more third-party
  // surfaces (Recharts, Upstash) land.
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );

  return res;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
