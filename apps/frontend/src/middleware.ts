// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await request.cookies.get('dev_secret_vault_auth_token')?.value;
   console.log("getting ", token)
  if (!token) {

    return NextResponse.redirect(new URL('/login', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/u/:path*"], 
};
