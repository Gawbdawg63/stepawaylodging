import { NextRequest, NextResponse } from "next/server";
import { fetchMessage, sendReply, markHandled, flagForReview, outlookConfigured } from "@/lib/outlook";
import { buildReply } from "@/lib/respond";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Sends one reply, on a deliberate click in the dashboard.
//
// The reply is rebuilt here from the live email rather than accepted from the
// browser: a caller can choose *which* inquiry to answer, never what the guest
// receives. That keeps a leaked job secret from turning this into a way to
// send arbitrary mail under the brand's name.

const SENDER_DOMAIN = process.env.BEACHCOMBERS_SENDER_DOMAIN?.trim() || "beachcombersnw.com";
const CATEGORY_SENT = "Quoted by Step Away bot";
const CATEGORY_REVIEW = "Needs a human";

function authorized(req: NextRequest): boolean {
  const secret = process.env.INQUIRY_JOB_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const header = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  return header === secret || req.headers.get("x-inquiry-secret")?.trim() === secret;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!outlookConfigured()) {
    return NextResponse.json({ error: "Outlook not configured (see .env.example)" }, { status: 503 });
  }

  const { messageId } = (await req.json().catch(() => ({}))) as { messageId?: string };
  if (!messageId) return NextResponse.json({ error: "missing messageId" }, { status: 400 });

  let message;
  try {
    message = await fetchMessage(messageId);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
  if (!message) {
    return NextResponse.json({ error: "That inquiry is no longer in the mailbox." }, { status: 404 });
  }

  const reply = await buildReply(message.subject, message.body, SENDER_DOMAIN);

  // The same rule the automatic job follows: nothing goes to a guest unless the
  // home, the dates and their address were all read cleanly.
  if (reply.kind === "needs-info") {
    return NextResponse.json(
      { error: `Not enough was readable to send: missing ${reply.inquiry.missing.join(", ")}.` },
      { status: 422 }
    );
  }
  // A blocked reply is sendable: it apologizes and points at live availability
  // without claiming anything about the calendar.

  const to = reply.inquiry.guestEmail ?? undefined;
  try {
    await sendReply(message.id, reply.html, to);
    // A priced reply is finished business; one we could not price stays
    // flagged, because the underlying failure still wants looking at.
    if (reply.kind === "blocked") await flagForReview(message.id, CATEGORY_REVIEW);
    else await markHandled(message.id, CATEGORY_SENT);
  } catch (e) {
    return NextResponse.json({ error: `Sending failed: ${String(e)}` }, { status: 502 });
  }

  return NextResponse.json({
    sent: true,
    to,
    kind: reply.kind,
    total: reply.quote?.total ?? null,
  });
}
