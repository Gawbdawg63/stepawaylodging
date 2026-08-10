import { photos } from "@/lib/content";

// A tasteful placeholder tile used until real photos are added to /public/photos.
function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] ${className}`}
      style={{
        background:
          "linear-gradient(135deg, var(--sea) 0%, var(--sea-700) 55%, #0b2a2b 100%)",
      }}
    >
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(120% 80% at 30% 0%, #ffffff 0%, transparent 60%)" }} />
      <div className="relative text-center text-white/80">
        <div className="font-display text-xl">{label}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/50">Photo coming soon</div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const hasPhotos = photos.length > 0;

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Gallery</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">Take a look around</h2>
        </div>
      </div>

      {hasPhotos ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {photos.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.file}
              src={`/photos/${p.file}`}
              alt={p.alt}
              className={`h-full w-full rounded-2xl object-cover ${
                i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Placeholder label="Living room" className="col-span-2 row-span-2 min-h-[220px] md:min-h-[420px]" />
          <Placeholder label="Ocean view" className="min-h-[100px] md:min-h-[200px]" />
          <Placeholder label="Kitchen" className="min-h-[100px] md:min-h-[200px]" />
          <Placeholder label="Bedroom" className="min-h-[100px] md:min-h-[200px]" />
          <Placeholder label="The deck" className="min-h-[100px] md:min-h-[200px]" />
        </div>
      )}

      {!hasPhotos && (
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Real photos drop straight in here — add them to <code className="rounded bg-white px-1.5 py-0.5">/public/photos</code> and list them in <code className="rounded bg-white px-1.5 py-0.5">lib/content.ts</code>.
        </p>
      )}
    </section>
  );
}
