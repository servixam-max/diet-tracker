import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/recipes", "/shopping", "/profile", "/onboarding"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for Supabase auth cookies (Supabase creates cookies starting with sb- and ending with auth-token)
  const cookies = request.cookies.getAll();
  const hasSupabaseCookie = cookies.some(c => 
    c.name.includes('sb-') && 
    (c.name.includes('auth-token') || c.name.includes('auth-code-verifier'))
  );
  
  const hasSession = hasSupabaseCookie;

  // Redirect to login if accessing protected route without session
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes with session
  if (authRoutes.some(route => pathname.startsWith(route)) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
