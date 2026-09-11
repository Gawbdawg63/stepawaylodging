import "server-only";
import { properties } from "@/lib/content";

// Server-only OwnerRez API client for availability search.
// Auth: HTTP Basic with the OwnerRez login as username + Personal Access Token
// as password. Token comes from the OWNERREZ_TOKEN env var (set in Vercel).

const BASE = "https://api.ownerrez.com";
const USERNAME = process.env.OWNERREZ_USERNAME || "lisa@bellabeachrentals.com";

// slug -> OwnerRez numeric property id (from GET /v2/properties)
const PROPERTY_IDS: Record<string, number> = {
  "ocean-peak-ridge": 479343,
  americana: 426111,
  "americanas-paris-suite": 469208,
  "barefoot-bungalow": 426113,
  "barefoot-carriage-house": 469209,
  "beach-bungalow-by-the-sea": 426115,
  "ebb-and-flow": 426116,
};

// Guest-facing booking links look like
//   https://booking.ownerrez.com/request?property=orp...&arrival=...&departure=...
// The property token is not the numeric id used by the API, nor the widget id
// on the website — it is a third identifier OwnerRez issues per property.
// Read them from GET /v2/properties (the dashboard lists the fields) and fill
// this in; any slug missing here simply falls back to the website page.
const PROPERTY_TOKENS: Record<string, string> = {
  "ocean-peak-ridge": "orp5b7506fx",
  // The rest fall back to the website page until their tokens are added.
  // Make one in OwnerRez (Bookings -> +Quote -> Public Link) and take the
  // property= value off the link; the dates used to make it do not matter.
};

// The "source" chosen alongside a public link in OwnerRez. Account-specific.
const BOOKING_CHANNEL = process.env.OWNERREZ_BOOKING_CHANNEL?.trim() || "";

// A link straight to OwnerRez's booking form with the stay filled in. Returns
// null when the token is unknown, so the caller can fall back rather than
// build a link that would 404 in front of a guest.
export function bookingRequestUrl(input: {
  slug: string;
  arrival: string;
  departure: string;
  adults: number;
  children?: number;
}): string | null {
  const token = PROPERTY_TOKENS[input.slug];
  if (!token) return null;

  const params = new URLSearchParams({
    property: token,
    arrival: input.arrival,
    departure: input.departure,
    adults: String(input.adults),
  });
  if (input.children && input.children > 0) params.set("children", String(input.children));
  if (BOOKING_CHANNEL) params.set("channel", BOOKING_CHANNEL);

  return `https://booking.ownerrez.com/request?${params}`;
}

// Lists properties with every field they carry, so the booking tokens above
// can be read off rather than guessed at.
export async function listPropertyFields(): Promise<
  { ok: false; reason: string } | { ok: true; rows: { field: string; value: string }[] }
> {
  const auth = authHeader();
  if (!auth) return { ok: false, reason: "OWNERREZ_TOKEN is not set." };
  try {
    const res = await orFetch(`/v2/properties?limit=50`, auth);
    if (!res.ok) return { ok: false, reason: `OwnerRez said ${res.status}: ${(await res.text()).slice(0, 300)}` };
    const data = (await res.json()) as { items?: unknown[] };
    const items = Array.isArray(data.items) ? data.items : [];
    return { ok: true, rows: items.flatMap((it, i) => collectFields(it, `#${i}`)) };
  } catch (e) {
    return { ok: false, reason: String(e) };
  }
}

function authHeader(): string | null {
  const token = process.env.OWNERREZ_TOKEN?.trim();
  if (!token) return null;
  return "Basic " + Buffer.from(`${USERNAME}:${token}`).toString("base64");
}

type Charge = { amount?: number };
type QuoteResponse = { charges?: Charge[] };

// Returns the total price if the property is available for the dates, else null.
async function quoteTotal(
  propertyId: number,
  arrival: string,
  departure: string,
  adults: number,
  auth: string
): Promise<number | null> {
  try {
    const res = await fetch(`${BASE}/v2/quotes`, {
      method: "POST",
      headers: {
        Authorization: auth,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ property_id: propertyId, arrival, departure, adults }),
      cache: "no-store",
    });
    if (!res.ok) return null; // unavailable dates or validation error
    const data = (await res.json()) as QuoteResponse;
    const total = (data.charges ?? []).reduce(
      (sum, c) => sum + (typeof c.amount === "number" ? c.amount : 0),
      0
    );
    return total > 0 ? Math.round(total) : null;
  } catch {
    return null;
  }
}

export type AvailabilityRow = { slug: string; available: boolean; total: number | null };

export type SearchOutcome =
  | { ok: false; reason: "no_dates" | "not_configured" }
  | { ok: true; rows: AvailabilityRow[] };

export async function searchAvailability(
  arrival?: string,
  departure?: string,
  adults = 2
): Promise<SearchOutcome> {
  if (!arrival || !departure) return { ok: false, reason: "no_dates" };
  const auth = authHeader();
  if (!auth) return { ok: false, reason: "not_configured" };

  const rows = await Promise.all(
    properties.map(async (p): Promise<AvailabilityRow> => {
      const id = PROPERTY_IDS[p.slug];
      if (!id) return { slug: p.slug, available: false, total: null };
      const total = await quoteTotal(id, arrival, departure, adults, auth);
      return { slug: p.slug, available: total !== null, total };
    })
  );
  return { ok: true, rows };
}

// A single home's price for specific dates, with the charge breakdown.
export type QuoteResult = {
  available: boolean;
  total: number | null;
  nights: number;
  charges: { label: string; amount: number }[];
};

export async function getQuote(
  slug: string,
  arrival: string,
  departure: string,
  adults = 2
): Promise<QuoteResult> {
  const nights = nightsBetween(arrival, departure);
  const id = PROPERTY_IDS[slug];
  const auth = authHeader();
  if (!id || !auth || !arrival || !departure) {
    return { available: false, total: null, nights, charges: [] };
  }
  try {
    const res = await fetch(`${BASE}/v2/quotes`, {
      method: "POST",
      headers: { Authorization: auth, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ property_id: id, arrival, departure, adults }),
      cache: "no-store",
    });
    if (!res.ok) return { available: false, total: null, nights, charges: [] };
    const data = (await res.json()) as {
      charges?: { amount?: number; description?: string; title?: string; name?: string; type?: string }[];
    };
    const charges = (data.charges ?? [])
      .map((c) => ({
        label: c.description || c.title || c.name || c.type || "Charge",
        amount: typeof c.amount === "number" ? c.amount : 0,
      }))
      .filter((c) => c.amount);
    const total = charges.reduce((s, c) => s + c.amount, 0);
    return { available: total > 0, total: total > 0 ? total : null, nights, charges };
  } catch {
    return { available: false, total: null, nights, charges: [] };
  }
}

export function nightsBetween(arrival: string, departure: string): number {
  const a = new Date(arrival + "T00:00:00");
  const d = new Date(departure + "T00:00:00");
  const n = Math.round((d.getTime() - a.getTime()) / 86400000);
  return n > 0 ? n : 0;
}

// ---------------------------------------------------------------------------
// Saved quotes
//
// getQuote() above only prices a stay — it throws the response away. To send a
// guest a real quote we need the record OwnerRez keeps, so these create one.
// ---------------------------------------------------------------------------

export type CreatedQuote = {
  id: number | null;
  total: number;
  nights: number;
  charges: { label: string; amount: number }[];
  guestId: number | null;
  expiresUtc: string;
  url: string | null; // OwnerRez-hosted quote link, when the API returns one
  // Every link OwnerRez sent back, as field/value pairs. Surfaced in the
  // dashboard so the right one can be identified by looking rather than
  // guessing at names that differ between their APIs.
  links: { field: string; url: string }[];
  // Every scalar the quote came back with, for identifying a link that is not
  // a bare http string — a payment-form token, an id, a relative path.
  fields: { field: string; value: string }[];
  // A guest-facing OwnerRez booking form with the stay filled in, when the
  // property's booking token is known.
  bookingUrl: string | null;
};

// Walks the response for anything that looks like a guest-facing link. Field
// names vary (url, quote_url, reservationRedirectUrl, payment form links), so
// this collects them all and lets the caller choose.
function collectLinks(value: unknown, path = "", depth = 0): { field: string; url: string }[] {
  if (depth > 2 || value == null) return [];
  if (typeof value === "string") {
    return /^https?:\/\//i.test(value) ? [{ field: path || "(root)", url: value }] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => collectLinks(v, `${path}[${i}]`, depth + 1));
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
      collectLinks(v, path ? `${path}.${k}` : k, depth + 1)
    );
  }
  return [];
}

// Flattens the response to field/value pairs. collectLinks only sees strings
// that already look like URLs; OwnerRez may hand back a payment-form token or
// an id that a link is built from, and this is how those become visible.
function collectFields(value: unknown, path = "", depth = 0): { field: string; value: string }[] {
  if (depth > 2 || value == null || path === "charges") return [];
  if (typeof value === "object") {
    if (Array.isArray(value)) return [];
    return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
      collectFields(v, path ? `${path}.${k}` : k, depth + 1)
    );
  }
  return [{ field: path, value: String(value).slice(0, 120) }];
}

// Prefer a link that takes the guest somewhere they can act, over a bare
// listing or image URL that happens to be in the payload.
function pickGuestLink(links: { field: string; url: string }[]): string | null {
  const byName = links.find((l) => /redirect|payment|book|quote|checkout|reserv/i.test(l.field));
  if (byName) return byName.url;
  const byPath = links.find((l) => /\/(quote|book|pay|reserv)/i.test(l.url));
  return byPath?.url ?? null;
}

async function orFetch(path: string, auth: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: auth,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
}

// Best-effort: reuse an existing guest record so repeat enquiries from the same
// person do not pile up duplicates. Never fatal — a quote can stand without a
// guest attached, and we would rather send a correct price than nothing.
async function findOrCreateGuest(
  auth: string,
  email: string,
  name: string | null,
  phone: string | null
): Promise<number | null> {
  try {
    const found = await orFetch(`/v2/guests?q=${encodeURIComponent(email)}`, auth);
    if (found.ok) {
      const data = (await found.json()) as { items?: { id?: number }[] };
      const id = data.items?.[0]?.id;
      if (typeof id === "number") return id;
    }

    const [first, ...rest] = (name ?? "").trim().split(/\s+/).filter(Boolean);
    const created = await orFetch(`/v2/guests`, auth, {
      method: "POST",
      body: JSON.stringify({
        first_name: first || "Guest",
        last_name: rest.join(" ") || "-",
        email_addresses: [{ address: email, type: "home", is_default: true }],
        ...(phone ? { phones: [{ number: phone, type: "mobile", is_default: true }] } : {}),
      }),
    });
    if (!created.ok) return null;
    const guest = (await created.json()) as { id?: number };
    return typeof guest.id === "number" ? guest.id : null;
  } catch {
    return null;
  }
}

// Telling a guest a home is booked when it is not is the worst thing this can
// do, so an unavailable stay and a failed request are kept apart. Only
// OwnerRez actually saying the dates are taken produces "unavailable";
// anything else is "failed", which goes to a human and never to a guest.
export type QuoteOutcome =
  | { status: "created"; quote: CreatedQuote }
  | { status: "unavailable" }
  | { status: "failed"; detail: string };

// Phrases OwnerRez uses when the dates genuinely cannot be booked. Anything
// outside this list is treated as a fault on our side, not a full calendar.
const UNAVAILABLE = /not available|unavailable|already booked|conflict|blocked|overlap|no availability|minimum stay|min stay|too short|cannot be booked/i;

export async function createQuote(input: {
  slug: string;
  arrival: string;
  departure: string;
  adults: number;
  children?: number;
  guestEmail?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  notes?: string;
  expiresInDays?: number;
}): Promise<QuoteOutcome> {
  const id = PROPERTY_IDS[input.slug];
  if (!id) return { status: "failed", detail: `No OwnerRez property id for "${input.slug}".` };

  const auth = authHeader();
  if (!auth) return { status: "failed", detail: "OWNERREZ_TOKEN is not set." };

  const nights = nightsBetween(input.arrival, input.departure);
  if (nights <= 0) return { status: "failed", detail: "The dates are not a real stay." };

  const guestId = input.guestEmail
    ? await findOrCreateGuest(auth, input.guestEmail, input.guestName ?? null, input.guestPhone ?? null)
    : null;

  const expiresUtc = new Date(Date.now() + (input.expiresInDays ?? 7) * 86400000).toISOString();

  try {
    const res = await orFetch(`/v2/quotes`, auth, {
      method: "POST",
      body: JSON.stringify({
        property_id: id,
        arrival: input.arrival,
        departure: input.departure,
        adults: input.adults,
        children: input.children ?? 0,
        generate_charges: true,
        // Nothing speculative goes in this body. OwnerRez rejects an unknown
        // field with a 400 for the whole request, so a guessed property name
        // does not degrade — it stops every quote from being created.
        expires_utc: expiresUtc,
        ...(guestId ? { guest_id: guestId } : {}),
        ...(input.notes ? { notes: input.notes } : {}),
      }),
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => "")).slice(0, 400);
      // Only OwnerRez saying the dates are taken counts as booked. A 500, a
      // rate limit, or a validation slip must never reach a guest as "sorry,
      // it's gone".
      return UNAVAILABLE.test(detail)
        ? { status: "unavailable" }
        : { status: "failed", detail: `OwnerRez said ${res.status}: ${detail || "no detail"}` };
    }

    const data = (await res.json()) as {
      id?: number;
      charges?: { amount?: number; description?: string; title?: string; name?: string; type?: string }[];
    } & Record<string, unknown>;

    const links = collectLinks(data);

    const charges = (data.charges ?? [])
      .map((c) => ({
        label: c.description || c.title || c.name || c.type || "Charge",
        amount: typeof c.amount === "number" ? c.amount : 0,
      }))
      .filter((c) => c.amount);
    const total = charges.reduce((s, c) => s + c.amount, 0);
    // A priced-at-zero quote means OwnerRez accepted the request but could not
    // price the stay — not a booked calendar.
    if (total <= 0) {
      return { status: "failed", detail: "OwnerRez returned a quote with no charges on it." };
    }

    const quote: CreatedQuote = {
      id: typeof data.id === "number" ? data.id : null,
      total: Math.round(total),
      nights,
      charges,
      guestId,
      expiresUtc,
      url: pickGuestLink(links),
      links,
      fields: collectFields(data),
      bookingUrl: bookingRequestUrl({
        slug: input.slug,
        arrival: input.arrival,
        departure: input.departure,
        adults: input.adults,
        children: input.children,
      }),
    };

    // The create response is lean on some accounts. When it carried no link,
    // read the quote back once — a read is safe, and it is the only way to see
    // whether a payment form or booking link exists at all.
    if (!quote.url && quote.id) {
      try {
        const full = await orFetch(`/v2/quotes/${quote.id}`, auth);
        if (full.ok) {
          const detail = (await full.json()) as Record<string, unknown>;
          const moreLinks = collectLinks(detail).map((l) => ({ ...l, field: `GET ${l.field}` }));
          quote.links = [...quote.links, ...moreLinks];
          quote.fields = [...quote.fields, ...collectFields(detail).map((f) => ({ ...f, field: `GET ${f.field}` }))];
          quote.url = pickGuestLink(quote.links);
        }
      } catch {
        // Diagnostics only — never let this cost us a working quote.
      }
    }

    return { status: "created", quote };
  } catch (e) {
    return { status: "failed", detail: `Could not reach OwnerRez: ${String(e)}` };
  }
}
