// A quiet band of credibility signals, shown under the hero.
export default function TrustStrip({ average, count }: { average?: number | null; count?: number | null }) {
  const items = [
    average && count
      ? { k: `${average}★`, v: `${count} guest reviews` }
      : { k: "Guest-loved", v: "Five-star reviews" },
    { k: "Family-owned", v: "30+ years on the coast" },
    { k: "Private hot tub", v: "in every home" },
    { k: "Book direct", v: "no service fees" },
    { k: "Local team", v: "here when you need us" },
  ];
  return (
    <section className="border-y border-[var(--border)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-5 py-7 text-center">
        {items.map((it, i) => (
          <div key={i} className="flex flex-col">
            <span className="font-display text-xl text-[var(--sea)]">{it.k}</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">{it.v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
