import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const checkPublicRoute = (path: string) => {
  return path === '/login' || path === '/signup';
}

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;  
    const isPublicRoute = checkPublicRoute(path);

    const token = (await cookies()).get("DEV_SECRET_VAULT_AUTH_TOKEN")?.value;

    if (path === '/') {
      if (token) {
        return NextResponse.redirect(new URL('/u/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    
    if (!token && (!isPublicRoute)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isPublicRoute) {
      return NextResponse.redirect(new URL('/u/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ["/u/:path*", "/login", "/signup", "/"], 
};
