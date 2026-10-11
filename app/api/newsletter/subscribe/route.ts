import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/outreach";

export const runtime = "nodejs";

// Public endpoint — the website email-signup form posts here to join the list.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; firstName?: string };
  const email = (body.email || "").trim();
  if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });
  try {
    await addSubscriber(email, body.firstName || "", "website");
    return NextResponse.json({ ok: true });
  } catch {
    // Never block the visitor on a storage hiccup.
    return NextResponse.json({ ok: true });
  }
}
