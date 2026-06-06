/**
 * GET  /api/config  — Fetch site config from GitHub Gist (KV-cached at Cloudflare edge)
 * POST /api/config  — Admin update: write to Gist + invalidate KV cache
 *
 * ALL secrets loaded from environment bindings (Cloudflare Dashboard):
 *   GIST_ID, GITHUB_TOKEN, CONFIG_CACHE (KV namespace binding)
 */
import type { NextRequest } from "next/server";
import type { GistData } from "../../types";

export const runtime = "edge";
const CACHE_KEY = "site_config_v1";
const CACHE_TTL = 300; // 5 minutes

async function fetchFromGist(id: string, token: string): Promise<GistData> {
  const res = await fetch(`https://api.github.com/gists/${id}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    cf: { cacheTtl: 60 },
  } as RequestInit);
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  const gist = await res.json();
  const content = gist.files?.["config.json"]?.content;
  if (!content) throw new Error("config.json missing from Gist");
  return JSON.parse(content) as GistData;
}

async function patchGist(id: string, token: string, data: GistData): Promise<void> {
  const res = await fetch(`https://api.github.com/gists/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify({ files: { "config.json": { content: JSON.stringify(data, null, 2) } } }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
}

export async function GET() {
  const env = process.env as any;
  try {
    if (env.CONFIG_CACHE) {
      const hit = await env.CONFIG_CACHE.get(CACHE_KEY, "json");
      if (hit) return Response.json(hit, { headers: { "X-Cache": "HIT", "Cache-Control": `public,s-maxage=${CACHE_TTL}` } });
    }
    const data = await fetchFromGist(env.GIST_ID, env.GITHUB_TOKEN);
    if (env.CONFIG_CACHE) await env.CONFIG_CACHE.put(CACHE_KEY, JSON.stringify(data), { expirationTtl: CACHE_TTL });
    return Response.json(data, { headers: { "X-Cache": "MISS", "Cache-Control": `public,s-maxage=${CACHE_TTL}` } });
  } catch (e: any) {
    console.error("[GET /api/config]", e.message);
    return Response.json({ error: "Failed to load config" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const env = process.env as any;
  try {
    const body = await req.json() as Partial<GistData>;
    const current = await fetchFromGist(env.GIST_ID, env.GITHUB_TOKEN);
    const updated: GistData = {
      ...current, ...body,
      config: { ...current.config, ...(body.config ?? {}), updatedAt: new Date().toISOString(), version: (current.config?.version ?? 0) + 1 },
    };
    await patchGist(env.GIST_ID, env.GITHUB_TOKEN, updated);
    if (env.CONFIG_CACHE) await env.CONFIG_CACHE.delete(CACHE_KEY);
    return Response.json({ success: true, version: updated.config.version });
  } catch (e: any) {
    console.error("[POST /api/config]", e.message);
    return Response.json({ error: "Config update failed" }, { status: 500 });
  }
}
