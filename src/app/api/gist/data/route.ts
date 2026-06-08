// ============================================================
// API: /api/gist/data — Public read of store data (cached)
// ============================================================

import { NextResponse } from "next/server";
import { fetchGistData } from "@/lib/gist";

export const revalidate = 30;

export async function GET() {
  const data = await fetchGistData();
  return NextResponse.json(data);
}
