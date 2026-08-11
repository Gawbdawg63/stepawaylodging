"use client";

import { useState } from "react";

type Charge = { label: string; amount: number };
type Quote = { available: boolean; total: number | null; nights: number; charges: Charge[] };
type Status = "idle" | "loading" | "done" | "error";

const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

// OwnerRez booking widget wants US-format dates in or_arrival / or_departure.
const toMdy = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${m}/${d}/${y}` : iso;
};

export default function PriceChecker({
  slug,
  maxGuests,
  booking,
}: {
  slug: string;
  maxGuests: number;
  booking: { widgetId: string; propertyId?: string };
}) {
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("2");
  const [status, setStatus] = useState<Status>("idle");
  const [quote, setQuote] = useState<Quote | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (!arrival || !departure) return;
    setStatus("loading");
    setQuote(null);
    try {
      const params = new URLSearchParams({ slug, arrival, departure, adults: guests });
      const res = await fetch(`/api/quote?${params.toString()}`);
      if (!res.ok) throw new Error("failed");
      setQuote((await res.json()) as Quote);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-left shadow-sm sm:p-8">
      <form onSubmit={check} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <Field label="Check in">
          <input type="date" min={today} value={arrival} onChange={(e) => setArrival(e.target.value)} required className="input" />
        </Field>
        <Field label="Check out">
          <input type="date" min={arrival || today} value={departure} onChange={(e) => setDeparture(e.target.value)} required className="input" />
        </Field>
        <Field label="Guests">
          <select value={guests} onChange={(e) => setGuests(e.target.value)} className="input">
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
            ))}
          </select>
        </Field>
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-[46px] rounded-xl bg-[var(--sand)] px-6 font-semibold text-white transition hover:bg-[var(--sand-600)] disabled:opacity-60"
        >
          {status === "loading" ? "Checking…" : "See price"}
        </button>
      </form>

      <style>{`.input{width:100%;border:1px solid var(--border);border-radius:.75rem;padding:.6rem .8rem;background:#fff;color:var(--foreground);outline:none}.input:focus{border-color:var(--sea);box-shadow:0 0 0 2px var(--sea-100)}`}</style>

      {status === "error" && (
        <p className="mt-5 text-sm text-red-600">Couldn&apos;t get a price just now — please try again, or use the booking form below.</p>
      )}

      {status === "done" && quote && (
        <div className="mt-6 border-t border-[var(--border)] pt-6">
          {quote.available && quote.total != null ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="text-sm text-[var(--muted)]">
                <div className="font-semibold uppercase tracking-wide text-[var(--sand-600)]">Your price</div>
                <ul className="mt-2 space-y-1">
                  {quote.charges.map((c, i) => (
                    <li key={i} className="flex justify-between gap-8">
                      <span>{c.label}</span>
                      <span className="tabular-nums text-[var(--foreground)]/80">{money(c.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-display text-3xl text-[var(--sea)]">{money(quote.total)}</div>
                <div className="text-sm text-[var(--muted)]">total{quote.nights ? ` · ${quote.nights} night${quote.nights > 1 ? "s" : ""}` : ""}</div>
                <a
                  href={`https://app.ownerrez.com/widgets/${booking.widgetId}?${new URLSearchParams({
                    ...(booking.propertyId ? { propertyKey: booking.propertyId } : {}),
                    or_arrival: toMdy(arrival),
                    or_departure: toMdy(departure),
                    or_adults: guests,
                  }).toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--sea)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--sea-700)]"
                >
                  Book these dates
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
                </a>
              </div>
            </div>
          ) : (
            <p className="text-[var(--muted)]">Not available for those dates — try different ones, or check the calendar below.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[var(--sand-600)]">{label}</span>
      {children}
    </label>
  );
}
