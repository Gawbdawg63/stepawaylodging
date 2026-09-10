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
};

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

// Creates the saved quote. Returns null when the dates are not bookable — an
// unavailable stay and a rejected request look the same from here, which is
// exactly how we want to treat them: no quote, no automatic reply.
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
}): Promise<CreatedQuote | null> {
  const id = PROPERTY_IDS[input.slug];
  const auth = authHeader();
  if (!id || !auth) return null;

  const nights = nightsBetween(input.arrival, input.departure);
  if (nights <= 0) return null;

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
        expires_utc: expiresUtc,
        ...(guestId ? { guest_id: guestId } : {}),
        ...(input.notes ? { notes: input.notes } : {}),
      }),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      id?: number;
      url?: string;
      quote_url?: string;
      charges?: { amount?: number; description?: string; title?: string; name?: string; type?: string }[];
    };

    const charges = (data.charges ?? [])
      .map((c) => ({
        label: c.description || c.title || c.name || c.type || "Charge",
        amount: typeof c.amount === "number" ? c.amount : 0,
      }))
      .filter((c) => c.amount);
    const total = charges.reduce((s, c) => s + c.amount, 0);
    if (total <= 0) return null;

    return {
      id: typeof data.id === "number" ? data.id : null,
      total: Math.round(total),
      nights,
      charges,
      guestId,
      expiresUtc,
      url: data.url || data.quote_url || null,
    };
  } catch {
    return null;
  }
}
