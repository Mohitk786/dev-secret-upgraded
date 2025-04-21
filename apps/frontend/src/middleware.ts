import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ROUTES } from "@/constants/data";

export async function middleware(request: NextRequest) {

  const token = request.cookies.get("dev_secret_vault_auth_token")
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/signup"];
  const isAuthPage = publicRoutes.includes(pathname);
  const isPrivateRoute = ["/u/dashboard", "/u/profile", "/u/settings"].some((route) =>
    pathname.startsWith(route)
  );

  if(pathname === "/") {
    return NextResponse.redirect(new URL("/u/dashboard", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/u/dashboard", request.url));
  }

  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Allow all other routes
  return NextResponse.next();
}
