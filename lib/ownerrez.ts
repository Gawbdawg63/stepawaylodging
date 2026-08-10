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

export function nightsBetween(arrival: string, departure: string): number {
  const a = new Date(arrival + "T00:00:00");
  const d = new Date(departure + "T00:00:00");
  const n = Math.round((d.getTime() - a.getTime()) / 86400000);
  return n > 0 ? n : 0;
}
