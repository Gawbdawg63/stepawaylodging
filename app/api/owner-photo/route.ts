import { put, get } from "@vercel/blob";
import { NextResponse } from "next/server";

// Owner-intake photo storage. The connected Blob store is PRIVATE, so we store
// photos privately and serve them back through this same route (streamed with
// the store token). Upload: POST bytes → returns a same-origin viewer URL that
// goes in the intake email. View: GET ?view=<pathname> streams the image.
export const runtime = "nodejs";
export const maxDuration = 30;

function blobToken(): string | undefined {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOBS_READ_WRITE_TOKEN ||
    process.env.STORAGE_BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN
  );
}

export async function GET(request: Request) {
  const view = new URL(request.url).searchParams.get("view");
  if (!view) return NextResponse.json({ error: "Missing view." }, { status: 400 });
  const token = blobToken();
  if (!token) return NextResponse.json({ error: "Storage not configured." }, { status: 500 });
  try {
    const res = await get(view, { access: "private", token });
    if (!res) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return new Response(res.stream, {
      headers: {
        "content-type": res.blob.contentType || "image/jpeg",
        "cache-control": "private, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const raw = new URL(request.url).searchParams.get("filename") || `photo-${Date.now()}.jpg`;
  const filename = raw.replace(/[^\w.\-]+/g, "_").slice(-80);
  if (!request.body) return NextResponse.json({ error: "No file received." }, { status: 400 });
  const token = blobToken();
  if (!token) return NextResponse.json({ error: "Storage not configured (no blob token found)." }, { status: 500 });
  try {
    const blob = await put(`owner-intake/${filename}`, request.body, {
      access: "private",
      addRandomSuffix: true,
      contentType: request.headers.get("content-type") || "image/jpeg",
      token,
    });
    const origin = new URL(request.url).origin;
    const viewerUrl = `${origin}/api/owner-photo?view=${encodeURIComponent(blob.pathname)}`;
    return NextResponse.json({ url: viewerUrl });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
