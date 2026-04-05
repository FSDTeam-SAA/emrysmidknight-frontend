import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTHOR_ONLY_PREFIXES = ["/dashboard", "/create-post"];
const SESSION_COOKIE_NAME = "next-auth.session-token-website";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthorOnlyRoute = AUTHOR_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isAuthorOnlyRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: SESSION_COOKIE_NAME,
  });

  if (!token) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/signin";
    signInUrl.searchParams.set(
      "callbackUrl",
      `${req.nextUrl.pathname}${req.nextUrl.search}`,
    );
    return NextResponse.redirect(signInUrl);
  }

  if (token.role !== "author") {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/create-post/:path*"],
};
