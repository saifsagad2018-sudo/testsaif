# Maison Lumière — Luxury Perfume E-Commerce Platform

## Architecture Overview

```
Browser → Cloudflare Edge (Workers/Pages)
            ├── Next.js App Router (Edge Runtime)
            ├── Cloudflare KV (config cache, 5min TTL)
            ├── GitHub Gist API (source of truth for config/products)
            └── Cloudinary CDN (all media assets)
```

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in real values in .env.local

npm run dev
```

## Cloudflare Deployment

```bash
# 1. Create KV namespace
wrangler kv:namespace create CONFIG_CACHE
# → Copy the returned ID into wrangler.toml

# 2. Set secrets (NEVER in code or .env committed to git)
wrangler secret put GIST_ID
wrangler secret put GITHUB_TOKEN
wrangler secret put CLOUDINARY_CLOUD_NAME
wrangler secret put CLOUDINARY_API_KEY
wrangler secret put CLOUDINARY_API_SECRET

# 3. Build & deploy to Cloudflare Pages
npm run build && npm run deploy
```

## GitHub Gist Setup

1. Create a new **secret** Gist at gist.github.com
2. Add a file named `config.json` with the GistData schema (see app/types/index.ts)
3. Copy the Gist ID from the URL
4. Set `GIST_ID` secret in Cloudflare Dashboard

## Cloudinary Setup

1. Create free/paid account at cloudinary.com
2. Dashboard → Settings → Upload Presets → Add unsigned preset named `maison_lumiere_unsigned`
3. Set folder to `maison-lumiere/` with auto-format, auto-quality
4. Copy Cloud Name, API Key, API Secret to Cloudflare secrets

## Security Model

- **Zero hardcoded secrets** — all sensitive values via Cloudflare environment bindings
- **Server-side uploads** — Cloudinary API secret never leaves the edge worker
- **KV caching** — GitHub API calls cached 5min at edge, reducing latency & rate limit risk
- **Signed uploads** — HMAC-SHA256 signed Cloudinary requests for upload integrity
- **Admin auth** — Add Cloudflare Access in front of `/admin/*` routes (zero-config SSO)

## File Structure

```
app/
├── api/
│   ├── config/route.ts    — Gist read/write + KV cache
│   └── upload/route.ts    — Signed Cloudinary uploads
├── lib/
│   ├── config.ts          — Client config fetcher + CSS var injector
│   └── cloudinary.ts      — Upload util + URL transformer
└── types/index.ts         — Full TypeScript schema
wrangler.toml              — Cloudflare Workers/Pages config
.env.example               — Required environment variables
```
