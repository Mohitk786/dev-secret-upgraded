// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";


const checkPublicRoute = (path: string) => {
  return path === '/login' || path === '/signup' || path === '/';
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;  
  const isPublicRoute = checkPublicRoute(path);

  const token = (await cookies()).get("DEV_SECRET_VAULT_AUTH_TOKEN")?.value;
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log("token", token);

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/u/dashboard', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/u/:path*", "/", "/login", "/signup"], 
};
