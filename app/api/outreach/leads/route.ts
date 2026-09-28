import { NextResponse } from "next/server";
import { loadLeads, saveLeads, countByStatus, type Lead, type LeadStatus } from "@/lib/outreach";
import { SEQUENCE } from "@/lib/outreach-sequence";

export const runtime = "nodejs";

function ok(request: Request, pw?: string): boolean {
  const admin = process.env.OUTREACH_ADMIN_PASSWORD;
  if (!admin) return false;
  const header = request.headers.get("x-admin-password");
  return header === admin || pw === admin;
}

// GET ?password= → list all leads + counts (for the admin dashboard).
export async function GET(request: Request) {
  const pw = new URL(request.url).searchParams.get("password") || undefined;
  if (!ok(request, pw)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const leads = await loadLeads();
  return NextResponse.json({ leads, counts: countByStatus(leads) });
}

// POST { password, action, ... }
//   action "import": { rows: [{email, firstName, property, city}] } → append new (dedup by email)
//   action "update": { id, changes: {status} }
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    password?: string;
    action?: string;
    rows?: { email: string; firstName?: string; property?: string; city?: string }[];
    id?: string;
    changes?: Partial<Lead>;
  };
  if (!ok(request, body.password)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await loadLeads();

  if (body.action === "import" && Array.isArray(body.rows)) {
    const existing = new Set(leads.map((l) => l.email.toLowerCase()));
    let added = 0;
    const nowIso = new Date().toISOString();
    for (const r of body.rows) {
      const email = (r.email || "").trim().toLowerCase();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || existing.has(email)) continue;
      existing.add(email);
      leads.push({
        id: cryptoId(),
        email,
        firstName: (r.firstName || "").trim(),
        property: (r.property || "").trim(),
        city: (r.city || "").trim(),
        status: "active",
        step: 0,
        nextSendAt: nowIso,
        createdAt: nowIso,
        history: [],
      });
      added++;
    }
    await saveLeads(leads);
    return NextResponse.json({ ok: true, added, counts: countByStatus(leads) });
  }

  if (body.action === "update" && body.id) {
    const lead = leads.find((l) => l.id === body.id);
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (body.changes?.status) {
      lead.status = body.changes.status as LeadStatus;
      if (lead.status === "unsubscribed") lead.unsubscribedAt = new Date().toISOString();
      // Reactivating a lead resumes from where it left off.
      if (lead.status === "active" && lead.step >= SEQUENCE.length) lead.step = Math.max(0, SEQUENCE.length - 1);
      if (lead.status === "active") lead.nextSendAt = new Date().toISOString();
    }
    await saveLeads(leads);
    return NextResponse.json({ ok: true, counts: countByStatus(leads) });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

function cryptoId(): string {
  return (globalThis.crypto?.randomUUID?.() ?? String(Date.now() + Math.random())).toString();
}
