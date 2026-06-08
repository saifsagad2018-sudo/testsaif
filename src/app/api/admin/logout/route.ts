// ============================================================
// API: /api/admin/logout — Clear session cookie
// ============================================================

import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(new URL("/admin/login", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
  res.cookies.delete("admin_session");
  return res;
}
