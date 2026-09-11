import { NextRequest, NextResponse } from "next/server";
import { listPropertyFields } from "@/lib/ownerrez";

export const dynamic = "force-dynamic";

// Read-only: lists every field OwnerRez holds for each property, so the
// booking token behind a public booking link can be read off rather than
// guessed at. Touches nothing.
export async function GET(req: NextRequest) {
  const secret = process.env.INQUIRY_JOB_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  const header = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!secret || (header !== secret && req.headers.get("x-inquiry-secret")?.trim() !== secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await listPropertyFields();
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 502 });
  return NextResponse.json({ rows: result.rows });
}
