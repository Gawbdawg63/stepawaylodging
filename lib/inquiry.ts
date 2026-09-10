import { properties } from "@/lib/content";

// Parses a Beachcombers NW inquiry email into structured booking details.
//
// Beachcombers NW is a directory: it forwards a guest's enquiry from one of its
// own addresses, with the guest's details in the body as labelled lines. The
// exact template varies by listing page and has changed over the years, so this
// parser is deliberately label-driven and tolerant rather than tied to one
// layout. Anything it cannot read with confidence is reported as missing, and
// the caller routes that inquiry to a human instead of guessing.

export type ParsedInquiry = {
  guestName: string | null;
  guestEmail: string | null;
  phone: string | null;
  slug: string | null; // matched Step Away Lodging property
  propertyText: string | null; // whatever the email called the home
  arrival: string | null; // YYYY-MM-DD
  departure: string | null; // YYYY-MM-DD
  adults: number;
  children: number;
  pets: boolean;
  note: string | null; // the guest's own message, if present
  missing: string[]; // what could not be read — empty means safe to auto-reply
};

// Names the directory (or a guest) may use that do not match our own spelling.
// The OwnerRez widget for Ocean Peak Ridge is itself titled "Ocean Peek Ridge",
// so this variant genuinely appears in the wild.
const ALIASES: Record<string, string> = {
  "ocean peek ridge": "ocean-peak-ridge",
  "oceanpeak ridge": "ocean-peak-ridge",
  "the americana": "americana",
  "paris suite": "americanas-paris-suite",
  "americana paris suite": "americanas-paris-suite",
  "carriage house": "barefoot-carriage-house",
  "beach bungalow": "beach-bungalow-by-the-sea",
  "ebb & flow": "ebb-and-flow",
  "ebb flow": "ebb-and-flow",
};

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Accepts the formats a directory form or a typing guest actually produces:
// 2026-07-04 · 7/4/2026 · 07/04/26 · July 4, 2026 · 4 July 2026 · Jul 4 2026.
export function parseDate(input: string, today = new Date()): string | null {
  const s = input.trim();

  const iso = s.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (iso) return validate(+iso[1], +iso[2], +iso[3]);

  const numeric = s.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})\b/);
  if (numeric) {
    // US ordering (month first) — Beachcombers NW and its guests are US-based.
    const year = numeric[3].length === 2 ? 2000 + +numeric[3] : +numeric[3];
    return validate(year, +numeric[1], +numeric[2]);
  }

  const monthFirst = s.match(/\b([a-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,)?\s*(\d{4})?\b/i);
  if (monthFirst && MONTHS[monthFirst[1].slice(0, 3).toLowerCase()]) {
    const month = MONTHS[monthFirst[1].slice(0, 3).toLowerCase()];
    return validate(monthFirst[3] ? +monthFirst[3] : inferYear(month, +monthFirst[2], today), month, +monthFirst[2]);
  }

  const dayFirst = s.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3,9})\.?(?:,)?\s*(\d{4})?\b/i);
  if (dayFirst && MONTHS[dayFirst[2].slice(0, 3).toLowerCase()]) {
    const month = MONTHS[dayFirst[2].slice(0, 3).toLowerCase()];
    return validate(dayFirst[3] ? +dayFirst[3] : inferYear(month, +dayFirst[1], today), month, +dayFirst[1]);
  }

  return null;
}

// A bare "July 4" means the next July 4 that has not already passed.
function inferYear(month: number, day: number, today: Date): number {
  const year = today.getUTCFullYear();
  const candidate = Date.UTC(year, month - 1, day);
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return candidate >= start ? year : year + 1;
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function validate(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null; // e.g. Feb 30
  return `${year}-${pad(month)}-${pad(day)}`;
}

// Pulls "Label: value" out of the text. Labels vary between templates, so each
// field passes several spellings and the first that hits wins.
//
// Two tolerances matter in practice. Templates pad labels with a noun
// ("Departure Date:", "Check-out day:"), and a label that came out of an HTML
// table can end up on its own line with the value on the next one.
const FILLER = "(?:\\s+(?:date|dates|day|on))?";

function clean(value: string | undefined): string | null {
  const v = value?.trim().replace(/\s*[|>]+\s*$/, "");
  return v && !/^(n\/?a|none|unknown|tbd|-+)$/i.test(v) ? v : null;
}

function field(text: string, labels: string[]): string | null {
  for (const label of labels) {
    const sameLine = text.match(new RegExp(`^[\\s>*|-]*${label}${FILLER}\\s*[:\\-\\t]\\s*(.+)$`, "im"));
    const value = clean(sameLine?.[1]);
    if (value) return value;
  }
  // Only if no label produced a value on its own line: a label alone on one
  // line, its value on the next.
  for (const label of labels) {
    const nextLine = text.match(new RegExp(`^[\\s>*|-]*${label}${FILLER}\\s*:?\\s*$\\n\\s*(.+)$`, "im"));
    const value = clean(nextLine?.[1]);
    if (value) return value;
  }
  return null;
}

export function matchProperty(text: string): string | null {
  const haystack = norm(text);

  for (const [alias, slug] of Object.entries(ALIASES)) {
    if (haystack.includes(norm(alias))) return slug;
  }
  // Longest name first so "Americana's Paris Suite" is not swallowed by "Americana".
  const byLength = [...properties].sort((a, b) => b.name.length - a.name.length);
  for (const p of byLength) {
    if (haystack.includes(norm(p.name)) || haystack.includes(norm(p.slug))) return p.slug;
  }
  return null;
}

function firstEmail(text: string, excludeDomain: string): string | null {
  const matches = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? [];
  const guest = matches.find((e) => {
    const lower = e.toLowerCase();
    return !lower.endsWith(`@${excludeDomain}`) && !lower.includes("noreply") && !lower.includes("no-reply");
  });
  return guest ?? null;
}

function count(value: string | null): number | null {
  const n = value?.match(/\d+/)?.[0];
  return n ? Number(n) : null;
}

export function parseInquiry(
  subject: string,
  body: string,
  opts: { senderDomain: string; today?: Date } = { senderDomain: "beachcombersnw.com" }
): ParsedInquiry {
  const text = `${subject}\n${body}`;
  const today = opts.today ?? new Date();

  // Bare "from"/"to" are deliberately absent: a forwarded message's header
  // block would match them. The unlabelled range regex below covers the
  // "from March 6 - March 9" phrasing instead.
  const arrivalRaw = field(body, [
    "arrival", "arrive", "arriving", "arrives",
    "check[- ]?in", "checkin", "coming",
    "start", "first night", "dates?",
  ]);
  const departureRaw = field(body, [
    "departure", "depart", "departing", "departs",
    "check[- ]?out", "checkout",
    "leaving", "leave", "leaves",
    "return", "returning", "going home",
    "end", "last night",
  ]);

  let arrival = arrivalRaw ? parseDate(arrivalRaw, today) : null;
  let departure = departureRaw ? parseDate(departureRaw, today) : null;

  // A range that names its month once — "October 1-8, 2026", "Nov 1 thru 8".
  // This is the shape that leaves an arrival parsed and a departure missing,
  // because the second half carries no month of its own.
  if (!arrival || !departure) {
    const sameMonth = body.match(
      /\b([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?\s*(?:-|–|—|to|through|thru|until)\s*(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?/i
    );
    if (sameMonth && MONTHS[sameMonth[1].slice(0, 3).toLowerCase()]) {
      const year = sameMonth[4] ?? "";
      arrival = arrival ?? parseDate(`${sameMonth[1]} ${sameMonth[2]} ${year}`, today);
      departure = departure ?? parseDate(`${sameMonth[1]} ${sameMonth[3]} ${year}`, today);
    }
  }

  // The same idea in slashes without a year — "10/1 - 10/8".
  if (!arrival || !departure) {
    const slashes = body.match(/\b(\d{1,2})\/(\d{1,2})\s*(?:-|–|—|to|through|thru|until)\s*(\d{1,2})\/(\d{1,2})\b(?!\s*[/-]\s*\d)/);
    if (slashes) {
      const year = today.getUTCFullYear();
      arrival = arrival ?? parseDate(`${slashes[1]}/${slashes[2]}/${year}`, today);
      departure = departure ?? parseDate(`${slashes[3]}/${slashes[4]}/${year}`, today);
      // A range that has already gone by means next year.
      if (arrival && departure && departure < arrival) departure = null;
    }
  }

  // Fall back to a "July 4 - July 11" / "7/4/26 to 7/11/26" range anywhere in
  // the text when the template used no labels at all.
  if (!arrival || !departure) {
    const range = body.match(
      /([A-Za-z]{3,9}\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s*\d{4})?|\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|\d{4}-\d{1,2}-\d{1,2})\s*(?:-|–|—|to|through|thru|until)\s*([A-Za-z]{3,9}\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s*\d{4})?|\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|\d{4}-\d{1,2}-\d{1,2})/i
    );
    if (range) {
      arrival = arrival ?? parseDate(range[1], today);
      departure = departure ?? parseDate(range[2], today);
    }
  }

  // Some forms ask for an arrival and a length of stay rather than two dates.
  if (arrival && !departure) {
    const nights = count(field(body, ["nights", "number of nights", "no. of nights", "length of stay", "stay"]));
    if (nights && nights > 0 && nights < 366) departure = addDays(arrival, nights);
  }

  const propertyText = field(body, ["property", "rental", "home", "listing", "unit", "house"]) ?? subject;
  const slug = matchProperty(text);

  const guests = count(field(body, ["guests", "number of guests", "total guests", "party size", "occupancy"]));
  const adults = count(field(body, ["adults"])) ?? guests ?? 2;
  const children = count(field(body, ["children", "kids"])) ?? 0;

  const petsRaw = field(body, ["pets", "pet", "dogs", "bringing a pet"]);
  const pets = Boolean(petsRaw && /^(y|yes|true|1|[1-9])/i.test(petsRaw));

  const parsed: ParsedInquiry = {
    guestName: field(body, ["guest name", "name", "guest", "contact"]),
    guestEmail: field(body, ["email", "e-mail", "email address", "reply to", "reply-to"])?.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0]
      ?? firstEmail(body, opts.senderDomain),
    phone: field(body, ["phone", "telephone", "cell", "mobile", "phone number"]),
    slug,
    propertyText,
    arrival,
    departure,
    adults,
    children,
    pets,
    note: field(body, ["message", "comments", "comment", "notes", "question", "additional info"]),
    missing: [],
  };

  // Only these three gate an automatic reply: without them the quote would be
  // for the wrong home, the wrong dates, or unsendable.
  if (!parsed.arrival) parsed.missing.push("arrival date");
  if (!parsed.departure) parsed.missing.push("departure date");
  if (!parsed.slug) parsed.missing.push("property");
  if (!parsed.guestEmail) parsed.missing.push("guest email");
  if (parsed.arrival && parsed.departure && parsed.departure <= parsed.arrival) {
    parsed.missing.push("valid date range");
  }

  return parsed;
}
