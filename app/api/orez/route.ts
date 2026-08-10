// TEMPORARY diagnostic route — discover OwnerRez API auth + response shapes,
// then removed. Secret-gated, read-only (GET only).
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SECRET = "sal-debug-7x9k2";
const BASE = "https://api.ownerrez.com";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  if (sp.get("key") !== SECRET) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const raw = process.env.OWNERREZ_TOKEN;
  if (!raw) {
    return NextResponse.json({ error: "OWNERREZ_TOKEN env var not set" }, { status: 500 });
  }
  const token = raw.trim();

  // Sanity-check the token shape without exposing it.
  if (sp.get("info")) {
    return NextResponse.json({
      rawLen: raw.length,
      trimmedLen: token.length,
      hadWhitespace: raw !== token,
      looksLikePrefixed: /^bearer\s/i.test(token) || /^basic\s/i.test(token),
    });
  }

  const mode = sp.get("auth") || "basictoken";
  let authHeader: string;
  if (mode === "bearer") {
    authHeader = `Bearer ${token}`;
  } else if (mode === "basicuser") {
    authHeader = "Basic " + Buffer.from(`${sp.get("user") ?? ""}:${token}`).toString("base64");
  } else {
    // basictoken: token as username, blank password
    authHeader = "Basic " + Buffer.from(`${token}:`).toString("base64");
  }

  // Optional: test a quote (POST) to check availability + pricing for a property.
  if (sp.get("quote")) {
    const body = {
      property_id: Number(sp.get("quote")),
      arrival: sp.get("arrival"),
      departure: sp.get("departure"),
      adults: Number(sp.get("adults") ?? "2"),
    };
    try {
      const res = await fetch(`${BASE}/v2/quotes`, {
        method: "POST",
        headers: { Authorization: authHeader, Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let parsed: unknown;
      try { parsed = JSON.parse(text); } catch { parsed = text.slice(0, 3000); }
      return NextResponse.json({ status: res.status, ok: res.ok, sent: body, body: parsed });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }

  const path = sp.get("path") || "/v2/properties";
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Authorization: authHeader, Accept: "application/json" },
    });
    const text = await res.text();
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      body = text.slice(0, 3000);
    }
    return NextResponse.json({ status: res.status, ok: res.ok, mode, path, body });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
