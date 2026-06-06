import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = req.cookies.get("admin-session");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD ?? "",
    uploadPreset: process.env.CLOUDINARY_PRESET ?? "",
  });
}
