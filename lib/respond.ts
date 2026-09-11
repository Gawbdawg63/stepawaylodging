import "server-only";
import { parseInquiry, type ParsedInquiry } from "@/lib/inquiry";
import { createQuote, searchAvailability, type CreatedQuote } from "@/lib/ownerrez";
import {
  composeQuoteReply,
  composeAlternativesReply,
  composeNeedsInfoReply,
  composeCouldNotPriceReply,
} from "@/lib/reply";
import { brand } from "@/lib/content";

// Works out what to say back to one inquiry. Shared by the scheduled job and
// the Send button, so a reply sent by hand is byte-for-byte the one the robot
// would have sent — there is no second implementation to drift.

export type Reply =
  | { kind: "needs-info"; inquiry: ParsedInquiry; html: string; quote: null; alternatives: [] }
  // OwnerRez would not price the stay. The guest still gets an answer — one
  // that never claims the dates are booked, and never invents a policy — and
  // the inquiry is still flagged for a person.
  | {
      kind: "blocked";
      inquiry: ParsedInquiry;
      detail: string;
      html: string;
      quote: null;
      alternatives: { slug: string; total: number }[];
    }
  | { kind: "quoted"; inquiry: ParsedInquiry; html: string; quote: CreatedQuote; alternatives: [] }
  | {
      kind: "alternatives";
      inquiry: ParsedInquiry;
      html: string;
      quote: null;
      alternatives: { slug: string; total: number }[];
    };

export async function buildReply(subject: string, body: string, senderDomain: string): Promise<Reply> {
  const inquiry = parseInquiry(subject, body, { senderDomain });

  // Anything unread confidently never gets a priced reply — a wrong home or a
  // wrong week reaching a guest is far worse than a slow answer.
  if (inquiry.missing.length) {
    return { kind: "needs-info", inquiry, html: composeNeedsInfoReply(inquiry), quote: null, alternatives: [] };
  }

  const outcome = await createQuote({
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

  if (outcome.status === "created") {
    const quote = outcome.quote;
    return { kind: "quoted", inquiry, html: composeQuoteReply(inquiry, quote), quote, alternatives: [] };
  }

  if (outcome.status === "failed") {
    // Only list homes OwnerRez positively confirmed as free. If it is having a
    // bad day, an empty list means "we did not find any", never "everything is
    // taken" — so silence is reported as silence, not as a full calendar.
    const alternatives = await freeElsewhere(inquiry);
    return {
      kind: "blocked",
      inquiry,
      detail: outcome.detail,
      html: composeCouldNotPriceReply(inquiry, { minNights: minNightsFrom(outcome.detail), alternatives }),
      quote: null,
      alternatives,
    };
  }

  // OwnerRez says the home really is taken. Offer whatever else is genuinely
  // free rather than sending the guest away with a bare "sorry".
  const search = await searchAvailability(inquiry.arrival!, inquiry.departure!, inquiry.adults);
  const alternatives = search.ok
    ? search.rows
        .filter((r) => r.available && r.total !== null && r.slug !== inquiry.slug)
        .map((r) => ({ slug: r.slug, total: r.total as number }))
        .sort((a, b) => a.total - b.total)
    : [];

  return {
    kind: "alternatives",
    inquiry,
    html: composeAlternativesReply(inquiry, alternatives),
    quote: null,
    alternatives,
  };
}

// Homes other than the one asked about that OwnerRez confirms are free.
async function freeElsewhere(inquiry: ParsedInquiry): Promise<{ slug: string; total: number }[]> {
  const search = await searchAvailability(inquiry.arrival!, inquiry.departure!, inquiry.adults);
  if (!search.ok) return [];
  return search.rows
    .filter((r) => r.available && r.total !== null && r.slug !== inquiry.slug)
    .map((r) => ({ slug: r.slug, total: r.total as number }))
    .sort((a, b) => a.total - b.total);
}

// A minimum-stay rule is the one refusal worth explaining to a guest, and the
// only one where OwnerRez names a number. Anything else stays unexplained
// rather than guessed at.
function minNightsFrom(detail: string): number | undefined {
  const m = detail.match(/(?:minimum|min)[^.]{0,30}?(\d{1,2})\s*night|(\d{1,2})\s*night[^.]{0,20}minimum/i);
  const n = Number(m?.[1] ?? m?.[2]);
  return Number.isFinite(n) && n > 1 && n < 31 ? n : undefined;
}

// Written onto the OwnerRez quote so the record says where it came from.
function quoteNote(inquiry: ParsedInquiry): string {
  return [
    `Auto-quoted from a Beachcombers NW enquiry (${brand.domain}).`,
    inquiry.guestName ? `Guest: ${inquiry.guestName}` : null,
    inquiry.phone ? `Phone: ${inquiry.phone}` : null,
    inquiry.pets ? "Guest mentioned pets." : null,
    inquiry.note ? `Their message: ${inquiry.note}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
