import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/lib/content";

export default function HomesGrid() {
  return (
    <section id="homes" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Our homes</p>
        <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Find your place on the coast</h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
          {properties.length} coastal homes and suites — from romantic hideaways for two to family
          houses that sleep ten. Every one comes with a hot tub.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}
