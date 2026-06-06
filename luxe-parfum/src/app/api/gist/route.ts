import { NextRequest, NextResponse } from "next/server";
import { fetchGistData, updateGistData } from "@/lib/gist";

export async function GET() {
  const data = await fetchGistData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get("admin-session");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const payload = await req.json();
    const ok = await updateGistData(payload);
    if (!ok) {
      return NextResponse.json({ error: "Failed to update. Check GIST_ID and GITHUB_TOKEN env vars." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
