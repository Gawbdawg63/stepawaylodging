import { NextRequest, NextResponse } from "next/server";
import { fetchInquiries, sendReply, saveDraftReply, markHandled, flagForReview, outlookConfigured } from "@/lib/outlook";
import { type ParsedInquiry } from "@/lib/inquiry";
import { buildReply } from "@/lib/respond";

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
  action: "quoted" | "offered-alternatives" | "needs-review" | "blocked" | "error";
  slug?: string | null;
  arrival?: string | null;
  departure?: string | null;
  total?: number;
  quoteId?: number | null;
  missing?: string[];
  excerpt?: string; // dry run only, and only when it could not be read
  bookUrl?: string; // where "Book these dates" points
  links?: { field: string; url: string }[]; // every link OwnerRez returned
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
  const reply = await buildReply(message.subject, message.body, SENDER_DOMAIN);
  const inquiry = reply.inquiry;
  const base = {
    messageId: message.id,
    subject: message.subject,
    guest: inquiry.guestEmail,
    slug: inquiry.slug,
    arrival: inquiry.arrival,
    departure: inquiry.departure,
  };

  if (reply.kind === "needs-info") {
    if (!dryRun) {
      await saveDraftReply(message.id, reply.html, inquiry.guestEmail ?? undefined);
      await flagForReview(message.id, CATEGORY_REVIEW);
    }
    return {
      ...base,
      action: "needs-review",
      missing: inquiry.missing,
      sent: false,
      // Showing the raw text is the difference between guessing at a template
      // and reading it. Dry run only, and only for the ones that failed.
      ...(dryRun ? { html: reply.html, excerpt: message.body.slice(0, 1500) } : {}),
    };
  }

  // A quote we could not price is never guessed at in front of a guest.
  if (reply.kind === "blocked") {
    if (!dryRun) await flagForReview(message.id, CATEGORY_REVIEW);
    return { ...base, action: "blocked", sent: false, error: reply.detail };
  }

  const sent = await deliver(message.id, reply.html, inquiry, dryRun);

  if (reply.kind === "quoted") {
    return {
      ...base,
      action: "quoted",
      total: reply.quote.total,
      quoteId: reply.quote.id,
      sent,
      ...(dryRun ? { html: reply.html, bookUrl: reply.quote.url ?? undefined, links: reply.quote.links } : {}),
    };
  }

  return { ...base, action: "offered-alternatives", sent, ...(dryRun ? { html: reply.html } : {}) };
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
