import { NextRequest, NextResponse } from "next/server";
import { fetchInquiries, sendReply, saveDraftReply, markHandled, flagForReview, outlookConfigured } from "@/lib/outlook";
import { parseInquiry, type ParsedInquiry } from "@/lib/inquiry";
import { createQuote, searchAvailability } from "@/lib/ownerrez";
import { composeQuoteReply, composeAlternativesReply, composeNeedsInfoReply } from "@/lib/reply";
import { brand } from "@/lib/content";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Reads unanswered Beachcombers NW inquiries from the Outlook mailbox, checks
// the dates against OwnerRez, creates a real quote, and replies to the guest.
//
// Runs on a schedule (see vercel.json) and can be triggered by hand. Both need
// the shared secret. Add ?dryRun=1 to see exactly what would be sent without
// sending anything or touching the mailbox — use that first after any change.

const SENDER_DOMAIN = process.env.BEACHCOMBERS_SENDER_DOMAIN?.trim() || "beachcombersnw.com";
const LOOKBACK_DAYS = Number(process.env.INQUIRY_LOOKBACK_DAYS ?? "3");
const CATEGORY_SENT = "Quoted by Step Away bot";
const CATEGORY_REVIEW = "Needs a human";

// The user asked for automatic sending; this exists so it can be turned off
// without a deploy if a reply ever goes out wrong.
const AUTO_SEND = (process.env.INQUIRY_AUTO_SEND ?? "true").toLowerCase() !== "false";

type Outcome = {
  messageId: string;
  subject: string;
  guest: string | null;
  action: "quoted" | "offered-alternatives" | "needs-review" | "error";
  slug?: string | null;
  arrival?: string | null;
  departure?: string | null;
  total?: number;
  quoteId?: number | null;
  missing?: string[];
  sent: boolean;
  error?: string;
  html?: string; // dry run only
};

function authorized(req: NextRequest): boolean {
  const secret = process.env.INQUIRY_JOB_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  if (!secret) return false; // fail closed: no secret configured means no access
  const header = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  return header === secret || req.headers.get("x-inquiry-secret")?.trim() === secret;
}

export async function GET(req: NextRequest) {
  return run(req);
}

export async function POST(req: NextRequest) {
  return run(req);
}

async function run(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!outlookConfigured()) {
    return NextResponse.json({ error: "Outlook not configured (see .env.example)" }, { status: 503 });
  }

  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10");

  let messages;
  try {
    messages = await fetchInquiries(SENDER_DOMAIN, LOOKBACK_DAYS, limit);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }

  const results: Outcome[] = [];
  for (const message of messages) {
    try {
      results.push(await handle(message, dryRun));
    } catch (e) {
      results.push({
        messageId: message.id,
        subject: message.subject,
        guest: null,
        action: "error",
        sent: false,
        error: String(e),
      });
    }
  }

  return NextResponse.json({
    dryRun,
    autoSend: AUTO_SEND,
    scanned: messages.length,
    results,
  });
}

async function handle(
  message: { id: string; subject: string; body: string; from: string },
  dryRun: boolean
): Promise<Outcome> {
  const inquiry = parseInquiry(message.subject, message.body, { senderDomain: SENDER_DOMAIN });
  const base = {
    messageId: message.id,
    subject: message.subject,
    guest: inquiry.guestEmail,
    slug: inquiry.slug,
    arrival: inquiry.arrival,
    departure: inquiry.departure,
  };

  // Anything we could not read confidently never gets an automatic reply — a
  // wrong home or a wrong week reaching a guest is far worse than a slow one.
  if (inquiry.missing.length) {
    const html = composeNeedsInfoReply(inquiry);
    if (!dryRun) {
      await saveDraftReply(message.id, html, inquiry.guestEmail ?? undefined);
      await flagForReview(message.id, CATEGORY_REVIEW);
    }
    return { ...base, action: "needs-review", missing: inquiry.missing, sent: false, ...(dryRun ? { html } : {}) };
  }

  const quote = await createQuote({
    slug: inquiry.slug!,
    arrival: inquiry.arrival!,
    departure: inquiry.departure!,
    adults: inquiry.adults,
    children: inquiry.children,
    guestEmail: inquiry.guestEmail,
    guestName: inquiry.guestName,
    guestPhone: inquiry.phone,
    notes: quoteNote(inquiry),
  });

  if (quote) {
    const html = composeQuoteReply(inquiry, quote);
    const sent = await deliver(message.id, html, inquiry, dryRun);
    return {
      ...base,
      action: "quoted",
      total: quote.total,
      quoteId: quote.id,
      sent,
      ...(dryRun ? { html } : {}),
    };
  }

  // The requested home is taken. Offer whatever else is genuinely free rather
  // than sending the guest away with a bare "sorry".
  const search = await searchAvailability(inquiry.arrival!, inquiry.departure!, inquiry.adults);
  const alternatives =
    search.ok
      ? search.rows
          .filter((r) => r.available && r.total !== null && r.slug !== inquiry.slug)
          .map((r) => ({ slug: r.slug, total: r.total as number }))
          .sort((a, b) => a.total - b.total)
      : [];

  const html = composeAlternativesReply(inquiry, alternatives);
  const sent = await deliver(message.id, html, inquiry, dryRun);
  return { ...base, action: "offered-alternatives", sent, ...(dryRun ? { html } : {}) };
}

async function deliver(
  messageId: string,
  html: string,
  inquiry: ParsedInquiry,
  dryRun: boolean
): Promise<boolean> {
  if (dryRun) return false;
  const to = inquiry.guestEmail ?? undefined;
  if (AUTO_SEND) {
    await sendReply(messageId, html, to);
    await markHandled(messageId, CATEGORY_SENT);
    return true;
  }
  await saveDraftReply(messageId, html, to);
  await flagForReview(messageId, CATEGORY_REVIEW);
  return false;
}

// Written onto the OwnerRez quote so the record says where it came from.
function quoteNote(inquiry: ParsedInquiry): string {
  const parts = [
    `Auto-quoted from a Beachcombers NW enquiry (${brand.domain}).`,
    inquiry.guestName ? `Guest: ${inquiry.guestName}` : null,
    inquiry.phone ? `Phone: ${inquiry.phone}` : null,
    inquiry.pets ? "Guest mentioned pets." : null,
    inquiry.note ? `Their message: ${inquiry.note}` : null,
  ];
  return parts.filter(Boolean).join("\n");
}
