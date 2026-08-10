"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// An on-brand availability search bar. On submit it routes to /search, which
// shows the live OwnerRez availability results for the chosen dates & guests.
export default function SearchBar({
  initialArrival = "",
  initialDeparture = "",
  initialGuests = "2",
}: {
  initialArrival?: string;
  initialDeparture?: string;
  initialGuests?: string;
}) {
  const router = useRouter();
  const [arrival, setArrival] = useState(initialArrival);
  const [departure, setDeparture] = useState(initialDeparture);
  const [guests, setGuests] = useState(initialGuests);

  const today = new Date().toISOString().slice(0, 10);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Plain ISO dates → /search runs a live availability check via the OwnerRez API.
    const params = new URLSearchParams();
    if (arrival) params.set("arrival", arrival);
    if (departure) params.set("departure", departure);
    if (guests) params.set("adults", guests);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-xl backdrop-blur sm:flex-row sm:items-stretch sm:rounded-full sm:p-2"
    >
      <Field label="Check in">
        <input type="date" min={today} value={arrival} onChange={(e) => setArrival(e.target.value)} className="w-full bg-transparent text-[var(--foreground)] outline-none" />
      </Field>
      <Divider />
      <Field label="Check out">
        <input type="date" min={arrival || today} value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full bg-transparent text-[var(--foreground)] outline-none" />
      </Field>
      <Divider />
      <Field label="Guests">
        <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full bg-transparent text-[var(--foreground)] outline-none">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
          ))}
        </select>
      </Field>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-[var(--sand)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--sand-600)] sm:rounded-full"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        Search
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-1 flex-col justify-center rounded-xl px-4 py-2 text-left transition hover:bg-black/[0.03] sm:rounded-full">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sand-600)]">{label}</span>
      {children}
    </label>
  );
}

function Divider() {
  return <span className="hidden w-px self-stretch bg-[var(--border)] sm:block" />;
}
