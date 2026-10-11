import Link from "next/link";

const perks = [
  { t: "No service fees", d: "Skip the 10–15% that Airbnb and Vrbo add at checkout. What you see is what you pay." },
  { t: "Better rates, direct", d: "You're booking straight with the family that cares for the home — no middleman markup." },
  { t: "A real person to call", d: "Local, family-owned, and reachable when you need us. We know every home inside and out." },
  { t: "Every home has a hot tub", d: "Plus ocean views, fireplaces, and the small touches that make a stay feel like yours." },
];

export default function BookDirect() {
  return (
    <section className="bg-[var(--sea)] text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand)]">Book direct &amp; save</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Why book with us, not a platform</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Booking direct at stepawaylodging.com means better value and a local family in your corner &mdash; not a faceless app.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.t} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="font-display text-xl">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{p.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/homes" className="inline-block rounded-full bg-[var(--sand)] px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[var(--sand-600)]">
            Browse homes &amp; check dates
          </Link>
        </div>
      </div>
    </section>
  );
}
