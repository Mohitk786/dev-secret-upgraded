import { useAuth } from "@/hooks/queries/authQueries";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
 
     

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isPrivateRoute = ["/u/dashboard", "/u/profile", "/u/settings"].some((route) =>
    pathname.startsWith(route)
  );

  //  If logged in & on login/register → redirect to dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/u/dashboard", request.url));
  }

  // If not logged in & on private route → redirect to login
  if (!user && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
