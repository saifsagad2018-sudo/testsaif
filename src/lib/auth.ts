// ============================================================
// AUTH — Simple server-side password check using ADMIN_PASS env var
// ============================================================

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

/**
 * Verify the submitted password against the ADMIN_PASS env var.
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass) throw new Error("ADMIN_PASS environment variable is not set");
  return password === adminPass;
}

/**
 * Check if the current request has a valid admin session cookie.
 */
export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === process.env.ADMIN_PASS;
}

/**
 * Create an admin session response with secure cookie.
 */
export function createAdminSession(redirectTo = "/admin"): NextResponse {
  const res = NextResponse.redirect(new URL(redirectTo, "http://localhost"));
  res.cookies.set(SESSION_COOKIE, process.env.ADMIN_PASS!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}

/**
 * Middleware guard — redirect to login if not authenticated.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const session = req.cookies.get(SESSION_COOKIE);
  if (session?.value !== process.env.ADMIN_PASS) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return null;
}
