import type { Review } from "@/lib/reviews";

const STAR = "M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9 6.1 20.9l1.1-6.47L2.5 9.85l6.5-.95L12 2.5z";

function Stars({ value, size = 18 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = (color: string) => (
    <span className="flex" style={{ color }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
  return (
    <span className="relative inline-flex" style={{ width: size * 5, height: size }} aria-label={`${value} out of 5 stars`}>
      {row("var(--border)")}
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>{row("var(--sand)")}</span>
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
      <Stars value={r.stars} size={16} />
      {r.title && <figcaption className="mt-3 font-display text-lg text-[var(--sea)]">{r.title}</figcaption>}
      <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-[var(--foreground)]/85 line-clamp-[10]">
        {r.body}
      </blockquote>
      <figcaption className="mt-4 text-sm">
        <span className="font-semibold text-[var(--sea)]">{r.author}</span>
        <span className="text-[var(--muted)]">
          {r.property ? ` · ${r.property}` : ""}
          {r.date ? ` · ${r.date}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews({
  heading,
  average,
  count,
  reviews,
  note,
}: {
  heading: string;
  average: number | null;
  count: number | null;
  reviews: Review[];
  note?: string;
}) {
  if (!reviews.length && average == null) return null;
  return (
    <section id="reviews" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Guest reviews</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">{heading}</h2>
          {average != null && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <Stars value={average} size={22} />
              <span className="font-display text-2xl text-[var(--sea)]">{average.toFixed(2)}</span>
              {count != null && <span className="text-[var(--muted)]">· {count} reviews</span>}
            </div>
          )}
          {note && <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted)]">{note}</p>}
        </div>

        {reviews.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <ReviewCard key={i} r={r} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
