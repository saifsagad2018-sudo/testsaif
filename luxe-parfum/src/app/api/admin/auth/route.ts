import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pass } = await req.json();
  const adminPass = process.env.ADMIN_PASS;

  if (!adminPass || pass !== adminPass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin-session", Buffer.from(String(Date.now())).toString("base64"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin-session");
  return res;
}
