/**
 * POST /api/upload — Signed Cloudinary upload (API secret stays server-side)
 *
 * Body: multipart/form-data { file: File, folder?: string, type?: string }
 * Secrets (Cloudflare Dashboard only):
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
import type { NextRequest } from "next/server";
import { createHmac } from "crypto";

export const runtime = "edge";

function signParams(params: Record<string, string | number>, secret: string): string {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join("&");
  return createHmac("sha256", secret).update(str).digest("hex");
}

export async function POST(req: NextRequest) {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloud || !key || !secret) return Response.json({ error: "Cloudinary not configured" }, { status: 500 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = String(form.get("folder") || "products");
  const type = String(form.get("type") || "product");

  if (!file) return Response.json({ error: "No file provided" }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ error: "Images only" }, { status: 400 });
  if (file.size > 10_485_760) return Response.json({ error: "Max file size: 10MB" }, { status: 400 });

  const timestamp = Math.round(Date.now() / 1000);
  const transformation = type === "logo" ? "f_auto,q_auto,w_400" : "f_auto,q_auto,w_1200,c_limit";
  const params = { folder: `maison-lumiere/${folder}`, timestamp, transformation };
  const signature = signParams(params, secret);

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", key);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  for (const [k, v] of Object.entries(params)) body.append(k, String(v));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body });
  if (!res.ok) { const e = await res.json(); return Response.json({ error: e.error?.message || "Upload failed" }, { status: 500 }); }

  const r = await res.json();
  return Response.json({ url: r.secure_url, publicId: r.public_id, width: r.width, height: r.height, format: r.format });
}
