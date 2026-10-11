// A map giving geographic context for the collection — most homes sit around
// Lincoln City, with a few toward Lincoln Beach and Depoe Bay.
export default function HomesMap() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Where you&apos;ll be</p>
        <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Our homes on the coast</h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Our homes are clustered along Oregon&apos;s central coast &mdash; mostly in and around Lincoln City, with a few
          toward Lincoln Beach and Depoe Bay. All within easy reach of the beach. Open any home to see its exact area.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
          <iframe
            title="Map of the Step Away Lodging area on the Oregon Coast"
            src="https://www.google.com/maps?q=Lincoln+City,+Oregon&z=12&output=embed"
            className="h-[380px] w-full sm:h-[460px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
