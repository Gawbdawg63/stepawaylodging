import { NextRequest, NextResponse } from "next/server";
import { parseInquiry } from "@/lib/inquiry";
import { htmlToText } from "@/lib/outlook";
import { composeQuoteReply, composeAlternativesReply, composeNeedsInfoReply } from "@/lib/reply";
import { getQuote } from "@/lib/ownerrez";

export const dynamic = "force-dynamic";

// Paste a real Beachcombers NW email in, see exactly what the pipeline would
// make of it. Reads nothing, sends nothing, creates no quote — it prices the
// stay read-only so the reply preview shows true numbers.
//
//   curl -X POST https://stepawaylodging.com/api/inquiries/preview \
//     -H "x-inquiry-secret: $INQUIRY_JOB_SECRET" \
//     -H "Content-Type: application/json" \
//     -d '{"subject":"...","body":"...paste the email..."}'
//
// This is the tool to reach for whenever a reply looks wrong: it shows whether
// the parser or the pricing is at fault, without involving a guest.

export async function POST(req: NextRequest) {
  const secret = process.env.INQUIRY_JOB_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  const header = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!secret || (header !== secret && req.headers.get("x-inquiry-secret")?.trim() !== secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { subject = "", body = "", isHtml } = (await req.json()) as {
    subject?: string;
    body?: string;
    isHtml?: boolean;
  };

  const senderDomain = process.env.BEACHCOMBERS_SENDER_DOMAIN?.trim() || "beachcombersnw.com";
  const text = isHtml ? htmlToText(body) : body;
  const inquiry = parseInquiry(subject, text, { senderDomain });

  if (inquiry.missing.length) {
    return NextResponse.json({
      parsed: inquiry,
      wouldSend: false,
      reason: `missing ${inquiry.missing.join(", ")} — would save a draft and flag for review`,
      html: composeNeedsInfoReply(inquiry),
    });
  }

  const priced = await getQuote(inquiry.slug!, inquiry.arrival!, inquiry.departure!, inquiry.adults);

  return NextResponse.json({
    parsed: inquiry,
    wouldSend: true,
    available: priced.available,
    html: priced.available
      ? composeQuoteReply(inquiry, {
          id: null,
          total: priced.total ?? 0,
          nights: priced.nights,
          charges: priced.charges,
          guestId: null,
          expiresUtc: new Date(Date.now() + 7 * 86400000).toISOString(),
          url: null,
          links: [],
        })
      : composeAlternativesReply(inquiry, []),
    note: priced.available
      ? "A real run would also create the saved OwnerRez quote and include its expiry."
      : "Home is unavailable; a real run would look up and list the alternatives that are free.",
  });
}
