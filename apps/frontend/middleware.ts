import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // ✅ Get the auth token from cookies
  const token = request.cookies.get("dev_secret_vault_auth_token")?.value;
  console.log("token", token)
  const { pathname } = request.nextUrl;

  // ✅ Define public & private routes
  const publicRoutes = ["/login", "/signup"];
  const isAuthPage = publicRoutes.includes(pathname);
  const isPrivateRoute = ["/u/dashboard", "/u/profile", "/u/settings"].some((route) =>
    pathname.startsWith(route)
  );


  // 🔒 If logged in and trying to visit a public route → redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/u/dashboard", request.url));
  }

  // 🔐 If not logged in and trying to visit a private route → redirect to login
  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Allow all other routes
  return NextResponse.next();
}
