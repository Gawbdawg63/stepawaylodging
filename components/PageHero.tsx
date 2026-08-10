// A compact dark banner for interior pages. Keeps the transparent header
// legible and gives every page a consistent, branded top.
export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0b2a2b 0%, var(--sea-700) 45%, var(--sea) 100%)" }} />
      <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(80% 60% at 75% 0%, #fff 0%, transparent 55%)" }} />
      <div className="relative mx-auto max-w-4xl px-5 pb-14 pt-32 text-center text-white sm:pb-16 sm:pt-36">
        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--sand)]">{eyebrow}</p>}
        <h1 className="font-display text-4xl leading-[1.08] sm:text-5xl md:text-6xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">{subtitle}</p>}
      </div>
    </section>
  );
}
