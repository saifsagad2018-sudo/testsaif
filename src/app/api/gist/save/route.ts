// ============================================================
// API: /api/gist/save — Save GistData (admin only)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { saveGistData } from "@/lib/gist";
import { isAdminAuthenticated } from "@/lib/auth";
import { GistData } from "@/types";

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as GistData;
    const ok = await saveGistData(body);
    return NextResponse.json({ ok });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
