import type { GistData } from "@/types";
import { DEFAULT_DATA } from "./themes";

const GIST_API = "https://api.github.com/gists";
const FILENAME = "luxe-parfum-data.json";

export async function fetchGistData(): Promise<GistData> {
  const gistId = process.env.GIST_ID;
  if (!gistId) return DEFAULT_DATA;

  try {
    const res = await fetch(`${GIST_API}/${gistId}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_DATA;
    const data = await res.json();
    const content = data.files?.[FILENAME]?.content;
    if (!content) return DEFAULT_DATA;
    const parsed = JSON.parse(content) as GistData;
    // Merge with defaults to ensure all fields exist
    return {
      ...DEFAULT_DATA,
      ...parsed,
      settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export async function updateGistData(payload: GistData): Promise<boolean> {
  const gistId = process.env.GIST_ID;
  const token = process.env.GITHUB_TOKEN;
  if (!gistId || !token) return false;

  try {
    const res = await fetch(`${GIST_API}/${gistId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          [FILENAME]: {
            content: JSON.stringify(payload, null, 2),
          },
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
