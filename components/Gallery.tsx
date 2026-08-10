import type { Photo } from "@/lib/content";

export default function Gallery({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

  // With a single photo, show it full-width rather than an awkward grid.
  if (photos.length === 1) {
    return (
      <section id="gallery" className="mx-auto max-w-6xl px-5 py-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/${photos[0].file}`} alt={photos[0].alt} className="max-h-[70vh] w-full rounded-2xl object-cover" />
      </section>
    );
  }

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Gallery</p>
        <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Take a look around</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {photos.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.file}
            src={`/${p.file}`}
            alt={p.alt}
            className={`h-full w-full rounded-2xl object-cover ${
              i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
