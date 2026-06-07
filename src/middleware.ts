import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken, JWT } from "next-auth/jwt";

export async function middleware(req: NextRequest) {

  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as JWT | null;

  const { pathname } = req.nextUrl;

  // ================= VERIFY PAGE =================
  const isVerifyPage =
    pathname.startsWith("/auth/verifyOtp");

  // ================= AUTH PAGES =================
  const isAuthPage =
    pathname === "/" ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    isVerifyPage;

  // ================= ROLE PAGES =================
  const isOrganizerPage =
    pathname.startsWith("/users/organizer");

  const isAttendeePage =
    pathname.startsWith("/users/attende");

  // ==================================================
  // المستخدم غير مسجل دخول
  // ==================================================
  if (!token && (isOrganizerPage || isAttendeePage)) {

    return NextResponse.redirect(
      new URL("/auth/login", req.url)
    );
  }

  // ==================================================
  // المستخدم مسجل دخول ويحاول دخول auth pages
  // ==================================================
  if (token && isAuthPage && !isVerifyPage) {

    if (token.role === "ORGANIZER") {

      return NextResponse.redirect(
        new URL("/users/organizer/Profile", req.url)
      );
    }

    if (token.role === "ATTENDEE") {

      return NextResponse.redirect(
        new URL("/users/attende/Profile", req.url)
      );
    }
  }

  // ==================================================
  // منع organizer من صفحات attendee
  // ==================================================
  if (
    token?.role === "ORGANIZER" &&
    isAttendeePage
  ) {

    return NextResponse.redirect(
      new URL("/users/organizer/Profile", req.url)
    );
  }

  // ==================================================
  // منع attendee من صفحات organizer
  // ==================================================
  if (
    token?.role === "ATTENDEE" &&
    isOrganizerPage
  ) {

    return NextResponse.redirect(
      new URL("/users/attende/Profile", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/verifyOtp",
    "/users/organizer/:path*",
    "/users/attende/:path*",
  ],
};