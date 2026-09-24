import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Issues short-lived, scoped upload tokens so an owner's browser can upload
// listing photos straight to Vercel Blob storage — no secrets in the client.
// Requires a Blob store connected to the project (env BLOB_READ_WRITE_TOKEN).
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/heic",
          "image/heif",
          "image/gif",
        ],
        maximumSizeInBytes: 30 * 1024 * 1024, // 30 MB per photo
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ source: "owner-intake" }),
      }),
      onUploadCompleted: async () => {
        // No-op — the client already holds the returned URL.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
