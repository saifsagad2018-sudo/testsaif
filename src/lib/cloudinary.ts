// ============================================================
// CLOUDINARY — Unsigned upload helper
// All credentials come from environment variables only.
// ============================================================

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

/**
 * Upload a file to Cloudinary using unsigned upload preset.
 * Called from the browser — never exposes tokens.
 * CLOUDINARY_CLOUD and CLOUDINARY_PRESET come from env (public NEXT_PUBLIC_* variants).
 */
export async function uploadToCloudinary(
  file: File,
  folder = "perfume-store"
): Promise<CloudinaryUploadResult> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

  if (!cloud || !preset) {
    throw new Error(
      "Cloudinary env vars missing: NEXT_PUBLIC_CLOUDINARY_CLOUD, NEXT_PUBLIC_CLOUDINARY_PRESET"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "Cloudinary upload failed");
  }

  return res.json();
}

/**
 * Build an optimized Cloudinary URL with transformations.
 */
export function cloudinaryUrl(
  publicId: string,
  opts: { w?: number; h?: number; q?: number; f?: string } = {}
): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
  if (!cloud) return publicId; // Already a full URL

  const { w = 800, h, q = "auto", f = "auto" } = opts;
  const transforms = [
    `w_${w}`,
    h ? `h_${h}` : null,
    `q_${q}`,
    `f_${f}`,
    "c_fill",
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${publicId}`;
}
