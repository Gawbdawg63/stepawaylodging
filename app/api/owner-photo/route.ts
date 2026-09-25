import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Same-origin photo upload for the owner intake portal. The browser resizes
// each photo first (see ListingIntakeForm), then POSTs the bytes here; we store
// them in Vercel Blob and return the public URL. No cross-origin calls, so no
// CORS. Requires BLOB_READ_WRITE_TOKEN (a Blob store connected to the project).
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const raw = new URL(request.url).searchParams.get("filename") || `photo-${Date.now()}.jpg`;
  const filename = raw.replace(/[^\w.\-]+/g, "_").slice(-80);
  if (!request.body) return NextResponse.json({ error: "No file received." }, { status: 400 });
  try {
    const blob = await put(`owner-intake/${filename}`, request.body, {
      access: "public",
      addRandomSuffix: true,
      contentType: request.headers.get("content-type") || "image/jpeg",
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
