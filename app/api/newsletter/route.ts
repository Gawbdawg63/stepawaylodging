import { NextResponse } from "next/server";
import { loadSubscribers, saveSubscribers, countSubs, runNewsletter, addSubscriber, type Subscriber } from "@/lib/outreach";

export const runtime = "nodejs";
export const maxDuration = 60;

function ok(request: Request, pw?: string): boolean {
  const admin = process.env.OUTREACH_ADMIN_PASSWORD;
  if (!admin) return false;
  return request.headers.get("x-admin-password") === admin || pw === admin;
}

// GET ?password= → list subscribers + counts
export async function GET(request: Request) {
  const pw = new URL(request.url).searchParams.get("password") || undefined;
  if (!ok(request, pw)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const subs = await loadSubscribers();
  return NextResponse.json({ subscribers: subs, counts: countSubs(subs) });
}

// POST { password, action, ... }
//   "add":    { rows:[{email,firstName}] }
//   "update": { id, changes:{status} }
//   "send":   { subject, body, test?:boolean }
export async function POST(request: Request) {
  const b = (await request.json().catch(() => ({}))) as {
    password?: string;
    action?: string;
    rows?: { email: string; firstName?: string }[];
    id?: string;
    changes?: Partial<Subscriber>;
    subject?: string;
    body?: string;
    test?: boolean;
  };
  if (!ok(request, b.password)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (b.action === "add" && Array.isArray(b.rows)) {
    let added = 0;
    for (const r of b.rows) if (await addSubscriber(r.email, r.firstName || "", "manual")) added++;
    const subs = await loadSubscribers();
    return NextResponse.json({ ok: true, added, counts: countSubs(subs) });
  }

  if (b.action === "update" && b.id) {
    const subs = await loadSubscribers();
    const s = subs.find((x) => x.id === b.id);
    if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (b.changes?.status) s.status = b.changes.status as Subscriber["status"];
    await saveSubscribers(subs);
    return NextResponse.json({ ok: true, counts: countSubs(subs) });
  }

  if (b.action === "send") {
    const subject = (b.subject || "").trim();
    const body = (b.body || "").trim();
    if (!subject || !body) return NextResponse.json({ error: "Subject and message are both required." }, { status: 400 });
    const testTo = b.test ? process.env.OUTREACH_FROM || "stay@stepawaylodging.com" : undefined;
    const result = await runNewsletter(subject, body, testTo ? { testTo } : undefined);
    return NextResponse.json({ ok: true, ...result, testTo });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
