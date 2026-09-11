import { brand, getProperty } from "@/lib/content";
import { nightsBetween, type CreatedQuote } from "@/lib/ownerrez";
import type { ParsedInquiry } from "@/lib/inquiry";

// Builds the HTML reply sent back through the Beachcombers NW thread.
// Plain, warm, and in the brand's own voice — no marketing furniture, because
// this lands in a guest's inbox as a direct answer to a question they asked.

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// The homes are all on the Oregon coast, so Pacific is the honest clock to
// quote an expiry in, and it is named so nobody has to guess.
function expiryMoment(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  }) + " Pacific";
}

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
  return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#22312f;">
${inner}
<p ${P}>Warmly,<br>The ${brand.name} team<br>
<a href="tel:${brand.phone.replace(/\D/g, "")}" style="color:#14494a;">${brand.phone}</a> ·
<a href="mailto:${brand.email}" style="color:#14494a;">${brand.email}</a><br>
<a href="https://${brand.domain}" style="color:#14494a;">${brand.domain}</a></p>
</div>`;
}

function depositLine(property?: { securityDeposit?: number }): string {
  const held = property?.securityDeposit ?? brand.securityDeposit;
  return held
    ? ` A refundable ${money(held)} security deposit is held against damage and released back to you after checkout.`
    : "";
}

function chargeTable(quote: CreatedQuote): string {
  const rows = quote.charges
    .map(
      (c) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#5c6a68;">${escapeHtml(c.label)}</td>` +
        `<td style="padding:6px 0;text-align:right;white-space:nowrap;">${money(c.amount)}</td></tr>`
    )
    .join("\n");

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-collapse:collapse;">
${rows}
<tr><td style="padding:10px 16px 0 0;border-top:1px solid #e6ddcf;font-weight:600;">Total</td>
<td style="padding:10px 0 0;border-top:1px solid #e6ddcf;text-align:right;font-weight:600;white-space:nowrap;">${money(quote.total)}</td></tr>
</table>`;
}

export function composeQuoteReply(inquiry: ParsedInquiry, quote: CreatedQuote): string {
  const property = getProperty(inquiry.slug ?? "");
  const name = property?.name ?? inquiry.propertyText ?? "the home";
  const stayUrl = property ? `https://${brand.domain}/homes/${property.slug}` : `https://${brand.domain}`;
  const bookUrl = quote.bookingUrl ?? quote.url ?? stayUrl;
  const guests = inquiry.adults + inquiry.children;

  // A refundable hold is not a charge, so it sits apart from the total rather
  // than in the table — but it has to be said, or "nothing added later" reads
  // as a promise the deposit then breaks.
  const deposit = depositLine(property);

  return shell(`<p ${P}>Hi ${escapeHtml(firstName(inquiry.guestName))},</p>

<p ${P}>Thanks so much for your inquiry about <strong>${escapeHtml(name)}</strong> — good news, it${"'"}s available for your dates.</p>

<p ${P}><strong>${longDate(inquiry.arrival!)}</strong> to <strong>${longDate(inquiry.departure!)}</strong><br>
${quote.nights} ${quote.nights === 1 ? "night" : "nights"} · ${guests} ${guests === 1 ? "guest" : "guests"}</p>

${chargeTable(quote)}

<p ${P}>That${"'"}s the full price to pay — rent, fees and taxes included, with nothing added later.${deposit}
${quote.id ? `I${"'"}ve put this quote on hold for you for the next 24 hours — until ${expiryMoment(quote.expiresUtc)}.` : ""}</p>

<p ${P}><a href="${bookUrl}" style="display:inline-block;background:#14494a;color:#fff;text-decoration:none;padding:11px 22px;border-radius:6px;font-weight:600;">Book these dates</a></p>

<p ${P}>You can see more photos and the full details at <a href="${stayUrl}" style="color:#14494a;">${escapeHtml(name)}</a>.
If you have any questions at all — or want to look at different dates — just reply to this email and I${"'"}ll help.</p>`);
}

export function composeAlternativesReply(
  inquiry: ParsedInquiry,
  alternatives: { slug: string; total: number }[],
  opts: { searched: boolean } = { searched: true }
): string {
  const property = getProperty(inquiry.slug ?? "");
  const name = property?.name ?? inquiry.propertyText ?? "that home";

  const list = alternatives
    .map((a) => {
      const p = getProperty(a.slug);
      if (!p) return "";
      return `<li style="margin-bottom:10px;">
<a href="https://${brand.domain}/homes/${p.slug}" style="color:#14494a;font-weight:600;">${escapeHtml(p.name)}</a>
— ${escapeHtml(p.location)}<br>
<span style="color:#5c6a68;">Sleeps ${p.stats.sleeps} · ${money(a.total)} total for your dates</span></li>`;
    })
    .filter(Boolean)
    .join("\n");

  const taken = `${escapeHtml(name)} is already booked for ${longDate(inquiry.arrival!)}–${longDate(inquiry.departure!)}`;
  const searchUrl = `https://${brand.domain}/search?arrival=${inquiry.arrival}&departure=${inquiry.departure}&adults=${Math.max(inquiry.adults + inquiry.children, 1)}`;

  const body = alternatives.length
    ? `<p ${P}>${taken}, but these homes of ours <em>are</em> free that week:</p>
<ul style="margin:0 0 16px;padding-left:20px;">${list}</ul>
<p ${P}>Every price above is the full total to pay — rent, fees and taxes included.${depositLine()} Happy to hold any of them for you, or to look at different dates if these are set.</p>`
    : opts.searched
      ? // The check ran and found nothing, so this is a fact we can state.
        `<p ${P}>Unfortunately ${taken}, and our other homes are taken that week too.</p>
<p ${P}>If your dates have any flexibility, tell me roughly when works and I${"'"}ll find you something — we often get cancellations, and I${"'"}m glad to keep an eye out for you.</p>`
      : // The check did not run. Not knowing is not the same as nothing being
        // free, so this points at live availability instead of asserting.
        `<p ${P}>Unfortunately ${taken}.</p>
<p ${P}>We have six other homes along the coast, and I${"'"}d rather show you what${"'"}s genuinely open than guess — here${"'"}s everything free for your dates:</p>
<p ${P}><a href="${searchUrl}" style="display:inline-block;background:#14494a;color:#fff;text-decoration:none;padding:11px 22px;border-radius:6px;font-weight:600;">See what&rsquo;s available</a></p>
<p ${P}>Or just reply with the dates you have in mind and I${"'"}ll sort it out personally.</p>`;

  return shell(`<p ${P}>Hi ${escapeHtml(firstName(inquiry.guestName))},</p>

<p ${P}>Thanks so much for your inquiry.</p>

${body}`);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Sent when OwnerRez would not price the stay. A guest who hears nothing
// assumes they were ignored, so this always says something — but it only
// states a reason when OwnerRez actually gave one. Where it did not, the note
// says plainly that the exact dates could not be priced and points at live
// availability, rather than inventing a policy to explain itself.
export function composeCouldNotPriceReply(
  inquiry: ParsedInquiry,
  opts: { minNights?: number; alternatives: { slug: string; total: number }[] }
): string {
  const property = getProperty(inquiry.slug ?? "");
  const name = property?.name ?? inquiry.propertyText ?? "that home";
  const guests = inquiry.adults + inquiry.children;
  const nights = inquiry.arrival && inquiry.departure ? nightsBetween(inquiry.arrival, inquiry.departure) : 0;

  const searchUrl =
    `https://${brand.domain}/search?arrival=${inquiry.arrival}&departure=${inquiry.departure}&adults=${Math.max(guests, 1)}`;

  const reason = opts.minNights
    ? `<p ${P}>${escapeHtml(name)} has a <strong>${opts.minNights}-night minimum</strong> for those dates, and
${nights === 1 ? "one night" : `${nights} nights`} falls just under it. If you can stretch the stay a little I&rsquo;d be glad to price it for you.</p>`
    : `<p ${P}>I wasn&rsquo;t able to get pricing back for <strong>${escapeHtml(name)}</strong> on those exact dates
&mdash; it may be a minimum-stay rule, or the calendar may have changed while your note was on its way.
Rather than leave you waiting, I wanted to reply straight away.</p>`;

  const alts = opts.alternatives.length
    ? `<p ${P}>These homes of ours <em>are</em> free that week, if any appeal:</p>
<ul style="margin:0 0 16px;padding-left:20px;">${opts.alternatives
        .map((a) => {
          const p = getProperty(a.slug);
          if (!p) return "";
          return `<li style="margin-bottom:10px;">
<a href="https://${brand.domain}/homes/${p.slug}" style="color:#14494a;font-weight:600;">${escapeHtml(p.name)}</a>
&mdash; ${escapeHtml(p.location)}<br>
<span style="color:#5c6a68;">Sleeps ${p.stats.sleeps} &middot; ${money(a.total)} total for your dates</span></li>`;
        })
        .filter(Boolean)
        .join("\n")}</ul>`
    : "";

  return shell(`<p ${P}>Hi ${escapeHtml(firstName(inquiry.guestName))},</p>

<p ${P}>Thanks so much for your inquiry.</p>

${reason}

${alts}

<p ${P}>You can also see everything we have open for ${longDate(inquiry.arrival!)}&ndash;${longDate(inquiry.departure!)} here:</p>

<p ${P}><a href="${searchUrl}" style="display:inline-block;background:#14494a;color:#fff;text-decoration:none;padding:11px 22px;border-radius:6px;font-weight:600;">See what&rsquo;s available</a></p>

<p ${P}>And if you just reply to this email with the dates you have in mind, I&rsquo;ll sort it out personally &mdash;
a real person reads every one of these.</p>`);
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
