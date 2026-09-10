import { brand, getProperty } from "@/lib/content";
import type { CreatedQuote } from "@/lib/ownerrez";
import type { ParsedInquiry } from "@/lib/inquiry";

// Builds the HTML reply sent back through the Beachcombers NW thread.
// Plain, warm, and in the brand's own voice — no marketing furniture, because
// this lands in a guest's inbox as a direct answer to a question they asked.

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function longDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function firstName(full: string | null): string {
  const first = (full ?? "").trim().split(/\s+/)[0];
  return first && /^[a-z'-]+$/i.test(first) ? first : "there";
}

const P = 'style="margin:0 0 14px;"';

function shell(inner: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#1c2b33;">
${inner}
<p ${P}>Warmly,<br>The ${brand.name} team<br>
<a href="tel:${brand.phone.replace(/\D/g, "")}" style="color:#1c6e8c;">${brand.phone}</a> ·
<a href="mailto:${brand.email}" style="color:#1c6e8c;">${brand.email}</a><br>
<a href="https://${brand.domain}" style="color:#1c6e8c;">${brand.domain}</a></p>
</div>`;
}

function chargeTable(quote: CreatedQuote): string {
  const rows = quote.charges
    .map(
      (c) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#4a5b66;">${escapeHtml(c.label)}</td>` +
        `<td style="padding:6px 0;text-align:right;white-space:nowrap;">${money(c.amount)}</td></tr>`
    )
    .join("\n");

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-collapse:collapse;">
${rows}
<tr><td style="padding:10px 16px 0 0;border-top:1px solid #dde5ea;font-weight:600;">Total</td>
<td style="padding:10px 0 0;border-top:1px solid #dde5ea;text-align:right;font-weight:600;white-space:nowrap;">${money(quote.total)}</td></tr>
</table>`;
}

export function composeQuoteReply(inquiry: ParsedInquiry, quote: CreatedQuote): string {
  const property = getProperty(inquiry.slug ?? "");
  const name = property?.name ?? inquiry.propertyText ?? "the home";
  const stayUrl = property ? `https://${brand.domain}/homes/${property.slug}` : `https://${brand.domain}`;
  const bookUrl = quote.url ?? stayUrl;
  const guests = inquiry.adults + inquiry.children;

  return shell(`<p ${P}>Hi ${escapeHtml(firstName(inquiry.guestName))},</p>

<p ${P}>Thanks so much for your enquiry about <strong>${escapeHtml(name)}</strong> — good news, it${"'"}s available for your dates.</p>

<p ${P}><strong>${longDate(inquiry.arrival!)}</strong> to <strong>${longDate(inquiry.departure!)}</strong><br>
${quote.nights} ${quote.nights === 1 ? "night" : "nights"} · ${guests} ${guests === 1 ? "guest" : "guests"}</p>

${chargeTable(quote)}

<p ${P}>That${"'"}s the full price — rent, fees and taxes included, with nothing added later.
${quote.id ? `I${"'"}ve put a quote on hold for you, good through ${longDate(quote.expiresUtc.slice(0, 10))}.` : ""}</p>

<p ${P}><a href="${bookUrl}" style="display:inline-block;background:#1c6e8c;color:#fff;text-decoration:none;padding:11px 22px;border-radius:6px;font-weight:600;">Book these dates</a></p>

<p ${P}>You can see more photos and the full details at <a href="${stayUrl}" style="color:#1c6e8c;">${escapeHtml(name)}</a>.
If you have any questions at all — or want to look at different dates — just reply to this email and I${"'"}ll help.</p>`);
}

export function composeAlternativesReply(
  inquiry: ParsedInquiry,
  alternatives: { slug: string; total: number }[]
): string {
  const property = getProperty(inquiry.slug ?? "");
  const name = property?.name ?? inquiry.propertyText ?? "that home";

  const list = alternatives
    .map((a) => {
      const p = getProperty(a.slug);
      if (!p) return "";
      return `<li style="margin-bottom:10px;">
<a href="https://${brand.domain}/homes/${p.slug}" style="color:#1c6e8c;font-weight:600;">${escapeHtml(p.name)}</a>
— ${escapeHtml(p.location)}<br>
<span style="color:#4a5b66;">Sleeps ${p.stats.sleeps} · ${money(a.total)} total for your dates</span></li>`;
    })
    .filter(Boolean)
    .join("\n");

  const body = alternatives.length
    ? `<p ${P}>${escapeHtml(name)} is already booked for ${longDate(inquiry.arrival!)}–${longDate(inquiry.departure!)}, but these homes of ours <em>are</em> free that week:</p>
<ul style="margin:0 0 16px;padding-left:20px;">${list}</ul>
<p ${P}>Every price above is the full total — rent, fees and taxes included. Happy to hold any of them for you, or to check different dates if these are set.</p>`
    : `<p ${P}>Unfortunately ${escapeHtml(name)} is already booked for ${longDate(inquiry.arrival!)}–${longDate(inquiry.departure!)}, and our other homes are taken that week too.</p>
<p ${P}>If your dates have any flexibility, tell me roughly when works and I${"'"}ll find you something — we often get cancellations, and I${"'"}m glad to keep an eye out for you.</p>`;

  return shell(`<p ${P}>Hi ${escapeHtml(firstName(inquiry.guestName))},</p>

<p ${P}>Thanks so much for your enquiry.</p>

${body}`);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Saved as a draft (never auto-sent) when the inquiry could not be read well
// enough to quote — so there is still something ready for a human to glance at
// and send, rather than a blank thread.
export function composeNeedsInfoReply(inquiry: ParsedInquiry): string {
  const asks: string[] = [];
  if (inquiry.missing.includes("arrival date") || inquiry.missing.includes("departure date")) {
    asks.push("the dates you have in mind (check-in and check-out)");
  }
  if (inquiry.missing.includes("valid date range")) asks.push("your check-in and check-out dates");
  if (inquiry.missing.includes("property")) asks.push("which of our homes caught your eye");

  const ask = asks.length
    ? `Could you let me know ${asks.join(", and ")}? I${"'"}ll send you exact pricing straight back.`
    : `Could you send me a couple more details and I${"'"}ll get you exact pricing straight back?`;

  return shell(`<p ${P}>Hi ${escapeHtml(firstName(inquiry.guestName))},</p>

<p ${P}>Thanks so much for getting in touch about a stay with us.</p>

<p ${P}>${ask}</p>`);
}
