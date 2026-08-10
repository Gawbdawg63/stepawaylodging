// TEMPORARY diagnostic route — discover the OwnerRez reviews response shape,
// then removed. Secret-gated, read-only (GET only).
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SECRET = "sal-debug-7x9k2";
const BASE = "https://api.ownerrez.com";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  if (sp.get("key") !== SECRET) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const token = process.env.OWNERREZ_TOKEN?.trim();
  if (!token) return NextResponse.json({ error: "OWNERREZ_TOKEN env var not set" }, { status: 500 });

  const user = sp.get("user") ?? "lisa@bellabeachrentals.com";
  const auth = "Basic " + Buffer.from(`${user}:${token}`).toString("base64");
  const path = sp.get("path") || "/v2/reviews";

  try {
    const res = await fetch(`${BASE}${path}`, { headers: { Authorization: auth, Accept: "application/json" } });
    const text = await res.text();
    let body: unknown;
    try { body = JSON.parse(text); } catch { body = text.slice(0, 3000); }
    return NextResponse.json({ status: res.status, ok: res.ok, path, body });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
