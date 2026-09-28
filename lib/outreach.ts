import "server-only";
import { get, put } from "@vercel/blob";
import crypto from "node:crypto";
import { SEQUENCE } from "@/lib/outreach-sequence";

// ============================================================================
// Owner-outreach engine. Sends the 5-touch sequence to STR owners via the
// user's Microsoft 365 mailbox (Graph API), stores leads in Vercel Blob, and
// auto-stops anyone who replies or unsubscribes. Costs $0/month.
// ============================================================================

export type LeadStatus = "active" | "replied" | "unsubscribed" | "done" | "error";
export type Lead = {
  id: string;
  email: string;
  firstName: string;
  property: string;
  city: string;
  status: LeadStatus;
  step: number; // number of emails sent so far (0..SEQUENCE.length)
  nextSendAt: string; // ISO — when the next email is due
  createdAt: string;
  lastSentAt?: string;
  repliedAt?: string;
  unsubscribedAt?: string;
  lastError?: string;
  history: { step: number; at: string }[];
};

const LEADS_PATH = "outreach/leads.json";
export const DAILY_LIMIT = Number(process.env.OUTREACH_DAILY_LIMIT || 10);
export const BASE = `https://${process.env.OUTREACH_DOMAIN || "stepawaylodging.com"}`;
export const FROM = process.env.OUTREACH_FROM || "stay@stepawaylodging.com";
const ADDRESS = process.env.OUTREACH_ADDRESS || "Step Away Lodging, Lincoln City, OR 97367";

function blobToken(): string | undefined {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOBS_READ_WRITE_TOKEN ||
    process.env.STORAGE_BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN
  );
}

// ---- Lead store (a single JSON file in Blob) --------------------------------
export async function loadLeads(): Promise<Lead[]> {
  const token = blobToken();
  if (!token) return [];
  try {
    // useCache:false is critical — this file is mutable state, and a cached read
    // would make the robot re-send the same step and lose sequence progress.
    const res = await get(LEADS_PATH, { access: "private", token, useCache: false });
    if (!res) return [];
    const text = await new Response(res.stream).text();
    return JSON.parse(text) as Lead[];
  } catch {
    return [];
  }
}

export async function saveLeads(leads: Lead[]): Promise<void> {
  const token = blobToken();
  if (!token) throw new Error("No blob token");
  await put(LEADS_PATH, JSON.stringify(leads, null, 2), {
    access: "private",
    token,
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

// ---- Unsubscribe token ------------------------------------------------------
function secret(): string {
  return process.env.OUTREACH_SECRET || process.env.OUTREACH_ADMIN_PASSWORD || "step-away-fallback-secret";
}
export function unsubToken(email: string): string {
  return crypto.createHmac("sha256", secret()).update(email.toLowerCase()).digest("hex").slice(0, 24);
}
export function unsubUrl(email: string): string {
  return `${BASE}/api/outreach/unsubscribe?e=${encodeURIComponent(email)}&t=${unsubToken(email)}`;
}

// ---- Email rendering --------------------------------------------------------
function merge(text: string, lead: Lead): string {
  return text
    .replace(/\{\{\s*first_name\s*\}\}/g, lead.firstName || "there")
    .replace(/\{\{\s*city\s*\}\}/g, lead.city || "Oregon Coast")
    .replace(/\{\{\s*property\s*\}\}/g, lead.property || "your rental");
}

export function renderEmail(stepIndex: number, lead: Lead): { subject: string; html: string } {
  const step = SEQUENCE[stepIndex];
  const subject = merge(step.subject, lead);
  const paragraphs = merge(step.body, lead)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;line-height:1.5">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
  const footer =
    `<p style="margin:20px 0 0;color:#888;font-size:12px;line-height:1.5">` +
    `${ADDRESS}<br>` +
    `If you'd rather not hear from us, <a href="${unsubUrl(lead.email)}">unsubscribe here</a>.` +
    `</p>`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#222">${paragraphs}${footer}</div>`;
  return { subject, html };
}

// ---- Microsoft Graph --------------------------------------------------------
export function graphConfigured(): boolean {
  return Boolean(process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET);
}

async function graphToken(): Promise<string> {
  const tenant = process.env.MS_TENANT_ID!;
  const body = new URLSearchParams({
    client_id: process.env.MS_CLIENT_ID!,
    client_secret: process.env.MS_CLIENT_SECRET!,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });
  const res = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Graph token failed: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

export async function sendEmail(token: string, to: string, subject: string, html: string): Promise<void> {
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(FROM)}/sendMail`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: "HTML", content: html },
        toRecipients: [{ emailAddress: { address: to } }],
      },
      saveToSentItems: true,
    }),
  });
  if (!res.ok) throw new Error(`sendMail failed: ${res.status} ${await res.text()}`);
}

// Returns a map of sender email -> the time of their most recent message to us.
// We use the timestamp so we only count messages that arrived AFTER we first
// emailed a lead — otherwise old correspondence in the inbox looks like a reply.
export async function fetchRepliers(token: string): Promise<Map<string, number>> {
  const url =
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(FROM)}/mailFolders/inbox/messages` +
    `?$top=200&$select=from,receivedDateTime&$orderby=receivedDateTime desc`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) return new Map();
  const data = (await res.json()) as {
    value?: { from?: { emailAddress?: { address?: string } }; receivedDateTime?: string }[];
  };
  const map = new Map<string, number>();
  for (const m of data.value ?? []) {
    const addr = m.from?.emailAddress?.address?.toLowerCase();
    const t = m.receivedDateTime ? Date.parse(m.receivedDateTime) : 0;
    if (addr && !map.has(addr)) map.set(addr, t); // first seen = most recent (desc order)
  }
  return map;
}

// ---- The daily run ----------------------------------------------------------
export async function runOutreach(): Promise<{ sent: number; skipped: string; counts: Record<string, number> }> {
  const leads = await loadLeads();
  const now = Date.now();

  if (graphConfigured()) {
    let token: string;
    try {
      token = await graphToken();
    } catch (e) {
      return { sent: 0, skipped: `Graph auth failed: ${(e as Error).message}`, counts: countByStatus(leads) };
    }

    // 1) Stop anyone who replied.
    try {
      const repliers = await fetchRepliers(token);
      for (const lead of leads) {
        if (lead.status !== "active" || lead.step < 1) continue;
        const replyAt = repliers.get(lead.email.toLowerCase());
        if (!replyAt) continue;
        // Only a genuine reply: a message that arrived after we first emailed them.
        const firstSent = lead.history[0]?.at ? Date.parse(lead.history[0].at) : lead.lastSentAt ? Date.parse(lead.lastSentAt) : 0;
        if (replyAt > firstSent) {
          lead.status = "replied";
          lead.repliedAt = new Date(now).toISOString();
        }
      }
    } catch {
      /* non-fatal */
    }

    // 2) Send to whoever is due, follow-ups first, up to the daily limit.
    const due = leads
      .filter((l) => l.status === "active" && new Date(l.nextSendAt).getTime() <= now && l.step < SEQUENCE.length)
      .sort((a, b) => b.step - a.step || new Date(a.nextSendAt).getTime() - new Date(b.nextSendAt).getTime());

    let sent = 0;
    for (const lead of due) {
      if (sent >= DAILY_LIMIT) break;
      const idx = lead.step;
      const { subject, html } = renderEmail(idx, lead);
      try {
        await sendEmail(token, lead.email, subject, html);
        sent++;
        lead.step = idx + 1;
        lead.lastSentAt = new Date(now).toISOString();
        lead.history.push({ step: idx + 1, at: new Date(now).toISOString() });
        if (lead.step >= SEQUENCE.length) {
          lead.status = "done";
        } else {
          lead.nextSendAt = new Date(now + SEQUENCE[lead.step].waitDays * 86400000).toISOString();
        }
      } catch (e) {
        lead.lastError = (e as Error).message;
      }
    }

    await saveLeads(leads);
    return { sent, skipped: "", counts: countByStatus(leads) };
  }

  return { sent: 0, skipped: "Microsoft 365 not connected yet (MS_* env vars missing).", counts: countByStatus(leads) };
}

export function countByStatus(leads: Lead[]): Record<string, number> {
  const c: Record<string, number> = { total: leads.length };
  for (const l of leads) c[l.status] = (c[l.status] || 0) + 1;
  return c;
}
