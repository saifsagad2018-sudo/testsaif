// ============================================================
// GIST API — Read & Write site data from GitHub Gist
// ============================================================

import { GistData } from "@/types";
import { DEFAULT_GIST_DATA } from "./defaults";

const GIST_API = "https://api.github.com/gists";

/**
 * Fetch site data from the GitHub Gist.
 * Falls back to DEFAULT_GIST_DATA if the Gist is unreachable.
 */
export async function fetchGistData(): Promise<GistData> {
  const gistId = process.env.GIST_ID;
  const token = process.env.GITHUB_TOKEN;

  if (!gistId) {
    console.warn("GIST_ID not set — using default data");
    return DEFAULT_GIST_DATA;
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${GIST_API}/${gistId}`, {
      headers,
      next: { revalidate: 30 }, // ISR — revalidate every 30 seconds
    });

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const json = await res.json();
    const fileContent = Object.values(json.files as Record<string, { content: string }>)[0]?.content;

    if (!fileContent) throw new Error("Empty Gist file");

    const data: GistData = JSON.parse(fileContent);
    // Merge with defaults so new fields don't break old Gists
    return {
      ...DEFAULT_GIST_DATA,
      ...data,
      settings: { ...DEFAULT_GIST_DATA.settings, ...data.settings },
    };
  } catch (err) {
    console.error("fetchGistData error:", err);
    return DEFAULT_GIST_DATA;
  }
}

/**
 * Update the GitHub Gist with new site data.
 * Only called from server-side Admin API routes.
 */
export async function saveGistData(data: GistData): Promise<boolean> {
  const gistId = process.env.GIST_ID;
  const token = process.env.GITHUB_TOKEN;

  if (!gistId || !token) {
    throw new Error("GIST_ID and GITHUB_TOKEN are required for saving data");
  }

  const res = await fetch(`${GIST_API}/${gistId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      files: {
        "store-data.json": {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });

  return res.ok;
}

/**
 * Initialize a new Gist with default data.
 * Run once during setup.
 */
export async function initGist(): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN required");

  const res = await fetch(GIST_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      description: "Luxury Perfume Store Data",
      public: false,
      files: {
        "store-data.json": {
          content: JSON.stringify(DEFAULT_GIST_DATA, null, 2),
        },
      },
    }),
  });

  const json = await res.json();
  return json.id as string;
}
