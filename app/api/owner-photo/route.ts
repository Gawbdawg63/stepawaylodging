import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Same-origin photo upload for the owner intake portal. The browser resizes
// each photo first (see ListingIntakeForm), then POSTs the bytes here; we store
// them in Vercel Blob and return the public URL. No cross-origin calls, so no
// CORS. Requires BLOB_READ_WRITE_TOKEN (a Blob store connected to the project).
export const runtime = "nodejs";
export const maxDuration = 30;

// The token env var name depends on how the Blob store was connected. Vercel's
// default is BLOB_READ_WRITE_TOKEN, but a custom-prefixed connection can name it
// BLOBS_READ_WRITE_TOKEN (etc.), so resolve it from the likely candidates.
function blobToken(): string | undefined {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOBS_READ_WRITE_TOKEN ||
    process.env.STORAGE_BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN
  );
}

export async function POST(request: Request) {
  const raw = new URL(request.url).searchParams.get("filename") || `photo-${Date.now()}.jpg`;
  const filename = raw.replace(/[^\w.\-]+/g, "_").slice(-80);
  if (!request.body) return NextResponse.json({ error: "No file received." }, { status: 400 });
  const token = blobToken();
  if (!token) return NextResponse.json({ error: "Storage not configured (no blob token found)." }, { status: 500 });
  try {
    const blob = await put(`owner-intake/${filename}`, request.body, {
      access: "public",
      addRandomSuffix: true,
      contentType: request.headers.get("content-type") || "image/jpeg",
      token,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
