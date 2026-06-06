export interface UploadResult { url: string; publicId: string; width: number; height: number; format?: string; }

export async function uploadImage(
  file: File,
  folder = "products",
  type = "product",
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const fd = new FormData();
  fd.append("file", file); fd.append("folder", folder); fd.append("type", type);
  if (onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = e => e.lengthComputable && onProgress(Math.round(e.loaded / e.total * 100));
      xhr.onload = () => (xhr.status < 300 ? resolve(JSON.parse(xhr.responseText)) : reject(new Error(`Upload ${xhr.status}`)));
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.open("POST", "/api/upload");
      xhr.send(fd);
    });
  }
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Upload failed"); }
  return res.json();
}

export function cdnUrl(url: string, width?: number, height?: number): string {
  if (!url.includes("cloudinary.com")) return url;
  const transforms = ["f_auto", "q_auto", width && `w_${width}`, height && `h_${height}`, "c_fill"].filter(Boolean).join(",");
  return url.replace("/upload/", `/upload/${transforms}/`);
}
