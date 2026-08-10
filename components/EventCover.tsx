import type { LcEvent } from "@/lib/events";

// A themed cover for an event: a real photo if provided, otherwise a tasteful
// gradient + motif so every event has a distinct, on-brand visual.
function Motif({ icon }: { icon: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "kite":
      return <svg viewBox="0 0 24 24" {...p}><path d="M12 3 20 11 12 15 4 11 Z" /><path d="M12 3V15" /><path d="M12 15l-1.5 6M12 15l1.5 4" /></svg>;
    case "float":
      return <svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="13" r="6.5" /><path d="M6.5 10.5c2 1.5 9 1.5 11 0M12 6.5V4M10.5 4h3" /></svg>;
    case "magic":
      return <svg viewBox="0 0 24 24" {...p}><path d="M5 19 16 8M14 6l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" /><path d="M6 9l.6-1.2L7.8 7l-1.2-.6L6 5.2 5.4 6.4 4.2 7l1.2.6Z" /></svg>;
    case "sandcastle":
      return <svg viewBox="0 0 24 24" {...p}><path d="M4 20h16M6 20v-6H4l4-4 4 4-2 0v6M14 20v-8l3-3 3 3v8M17 9V6l1 1" /></svg>;
    case "drum":
      return <svg viewBox="0 0 24 24" {...p}><ellipse cx="12" cy="9" rx="7" ry="3" /><path d="M5 9v5c0 1.6 3.1 3 7 3s7-1.4 7-3V9" /><path d="M9 15l-3 4M15 15l3 4" /></svg>;
    case "vintage":
      return <svg viewBox="0 0 24 24" {...p}><rect x="4" y="8" width="16" height="12" rx="1" /><path d="M8 8V6a4 4 0 0 1 8 0v2M12 12v4" /></svg>;
    case "moon":
      return <svg viewBox="0 0 24 24" {...p}><path d="M20 14a7 7 0 1 1-8-9 6 6 0 0 0 8 9Z" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

export default function EventCover({
  event,
  className = "",
}: {
  event: LcEvent;
  className?: string;
}) {
  if (event.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/${event.photo}`} alt={event.title} className={`object-cover ${className}`} />;
  }
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(140deg, ${event.theme.from} 0%, ${event.theme.to} 100%)` }}
    >
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(120% 80% at 25% 0%, #fff 0%, transparent 55%)" }} />
      <div className="relative h-14 w-14 text-white/90">
        <Motif icon={event.theme.icon} />
      </div>
      <span className="absolute bottom-3 left-4 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur">
        {event.category}
      </span>
    </div>
  );
}
