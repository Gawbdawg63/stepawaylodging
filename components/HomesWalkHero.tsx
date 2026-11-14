"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";

export type WalkHome = {
  slug: string;
  name: string;
  location: string;
  photo: string; // path under /public, e.g. "homes/americana/01.jpg"
  sleeps: number;
  bedrooms: number;
  bathrooms: number;
};

// How much scrolling each home takes, in screen heights.
const SCREENS_PER_HOME = 0.85;
// Share of each home's scroll spent zooming through into the next one.
const BLEND = 0.34;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

// Camera moves alternate so the walk feels like turning from home to home:
// [centre x, centre y, zoom] at the start and end of each home (0–1 of the photo).
const CAMERAS: [number[], number[]][] = [
  [[0.42, 0.55, 1.0], [0.56, 0.5, 1.28]],
  [[0.6, 0.52, 1.02], [0.44, 0.5, 1.3]],
  [[0.5, 0.58, 1.0], [0.5, 0.48, 1.32]],
];

// Pick the smallest optimized image in a srcSet that still covers the screen.
function pickSrc(srcSet: string, fallback: string, need: number) {
  const options = srcSet
    .split(",")
    .map((s) => s.trim().split(/\s+/))
    .map(([url, w]) => ({ url, w: parseInt(w, 10) }))
    .filter((o) => o.url && o.w)
    .sort((a, b) => a.w - b.w);
  return (options.find((o) => o.w >= need) ?? options[options.length - 1])?.url ?? fallback;
}

const REDUCED = () => window.matchMedia("(prefers-reduced-motion: reduce)");
function subscribeMotion(cb: () => void) {
  const mq = REDUCED();
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export default function HomesWalkHero({ homes, children }: { homes: WalkHome[]; children: React.ReactNode }) {
  const N = homes.length;
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  // Animate only in the browser, and not for visitors who ask for reduced motion.
  const motionOk = useSyncExternalStore(subscribeMotion, () => !REDUCED().matches, () => false);
  const animated = motionOk && N > 1;

  useEffect(() => {
    if (!animated) return;
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const g = canvas.getContext("2d")!;
    let W = 0, H = 0;

    const need = Math.min(3840, Math.round(Math.max(window.innerWidth, window.innerHeight * 1.5) * Math.min(2, window.devicePixelRatio || 1)));
    const imgs = homes.map((h) => {
      const { props } = getImageProps({ src: `/${h.photo}`, alt: "", fill: true, sizes: "100vw", quality: 75 });
      const im = new window.Image();
      im.decoding = "async";
      im.src = pickSrc(props.srcSet ?? "", props.src, need);
      im.onload = () => draw(cur);
      return im;
    });

    function shot(i: number, k: number, push: number, alpha: number) {
      const im = imgs[i];
      if (!im.complete || !im.naturalWidth) return;
      const [a, b] = CAMERAS[i % CAMERAS.length];
      const iw = im.naturalWidth, ih = im.naturalHeight;
      const z = lerp(a[2], b[2], k) * push;
      let ch = ih / z, cw = (ch * W) / H;
      if (cw > iw / z) { cw = iw / z; ch = (cw * H) / W; }
      const cx = clamp(lerp(a[0], b[0], k) * iw, cw / 2, iw - cw / 2);
      const cy = clamp(lerp(a[1], b[1], k) * ih, ch / 2, ih - ch / 2);
      g.globalAlpha = alpha;
      g.drawImage(im, cx - cw / 2, cy - ch / 2, cw, ch, 0, 0, W, H);
      g.globalAlpha = 1;
    }

    // q runs 0..N: the whole part is the home, the fraction is how far into it you are.
    function draw(q: number) {
      if (!W) return;
      g.fillStyle = "#0b2a2b";
      g.fillRect(0, 0, W, H);
      const i = Math.min(N - 1, Math.floor(q)), f = q - i;
      const blend = i < N - 1 ? clamp((f - (1 - BLEND)) / BLEND) : 0;
      shot(i, smooth(f), 1 + 0.22 * blend * blend, 1);
      if (blend > 0) shot(i + 1, 0, 1, smooth(blend));

      const shown = blend > 0.5 ? i + 1 : i;
      const local = blend > 0.5 ? 0 : f;

      // Intro copy and search fade out as the walk begins; the tint lightens so the homes show.
      const intro = clamp(1 - q / 0.4);
      const el = introRef.current!;
      el.style.opacity = String(intro);
      el.style.transform = `translateY(${(1 - intro) * -40}px)`;
      el.style.pointerEvents = intro > 0.6 ? "auto" : "none";
      el.style.visibility = intro <= 0 ? "hidden" : "visible";
      tintRef.current!.style.opacity = String(0.35 + 0.65 * intro);

      cardRefs.current.forEach((card, j) => {
        if (!card) return;
        let o = 0;
        if (j === shown && q > 0.45) {
          const fadeOut = j === N - 1 ? clamp((N - 0.55 - q) / 0.15) : clamp((1 - BLEND - local) / 0.1);
          o = Math.min(clamp((local - (j === 0 ? 0.45 : 0.05)) / 0.15), fadeOut);
        }
        card.style.opacity = String(o);
        card.style.transform = `translateY(${(1 - o) * 18}px)`;
        card.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });

      const end = clamp((q - (N - 0.5)) / 0.25);
      endRef.current!.style.opacity = String(end);
      endRef.current!.style.pointerEvents = end > 0.6 ? "auto" : "none";
      endRef.current!.style.visibility = end <= 0 ? "hidden" : "visible";

      if (counterRef.current) counterRef.current.textContent = `${String(shown + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${clamp(q / N)})`;
    }

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(cur);
    }

    // Ease toward the scroll position so the walk glides instead of jumping.
    let target = 0, cur = 0, raf = 0;
    const progress = () => {
      const r = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      return total > 0 ? Math.min(clamp(-r.top / total) * N, N - 0.0001) : 0;
    };
    const tick = () => {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      draw(cur);
      raf = cur !== target ? requestAnimationFrame(tick) : 0;
    };
    const onScroll = () => { target = progress(); if (!raf) raf = requestAnimationFrame(tick); };

    resize();
    cur = target = progress();
    draw(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [animated, homes, N]);

  const first = homes[0];

  return (
    <section
      ref={sectionRef}
      aria-label="Step Away Lodging homes"
      className="relative"
      style={animated ? { height: `calc(${N * SCREENS_PER_HOME * 100}svh + 100svh)` } : undefined}
    >
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden">
        {/* First home as a real image: fast first paint, and what shows without the animation */}
        <Image src={`/${first.photo}`} alt={`${first.name}, ${first.location}`} fill priority sizes="100vw" className="object-cover" />
        <canvas ref={canvasRef} aria-hidden="true" className={`absolute inset-0 h-full w-full ${animated ? "" : "hidden"}`} />

        <div ref={tintRef} className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(165deg, rgba(11,42,43,0.72) 0%, rgba(15,56,57,0.5) 45%, rgba(20,73,74,0.72) 100%)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/45 to-transparent" />

        {/* Intro: the original hero copy and search */}
        <div ref={introRef} className="absolute inset-0 flex items-center justify-center">
          <div className="relative mx-auto max-w-3xl px-5 pt-24 text-center text-white">{children}</div>
        </div>

        {animated && (
          <>
            {homes.map((h, j) => (
              <div
                key={h.slug}
                ref={(el) => { cardRefs.current[j] = el; }}
                className="absolute inset-x-0 bottom-28 px-5 text-center text-white opacity-0 sm:bottom-16 sm:left-10 sm:right-auto sm:px-0 sm:text-left md:left-16"
                style={{ pointerEvents: "none" }}
              >
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/80 drop-shadow">{h.location}</p>
                <h2 className="mt-2 font-display text-4xl leading-tight drop-shadow-lg sm:text-5xl md:text-6xl">{h.name}</h2>
                <p className="mt-2 text-sm text-white/90 drop-shadow">Sleeps {h.sleeps} · {h.bedrooms} bd · {num(h.bathrooms)} ba · Hot tub</p>
                <Link href={`/homes/${h.slug}`} className="mt-5 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--sea)] shadow-lg transition hover:bg-[var(--sand)]">
                  View home →
                </Link>
              </div>
            ))}

            <div ref={endRef} className="invisible absolute inset-0 flex flex-col items-center justify-center bg-[rgba(11,42,43,0.55)] px-5 text-center text-white opacity-0">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/75">{N} homes · each with a hot tub</p>
              <h2 className="mt-3 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">Find your stay</h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/homes" className="rounded-full bg-white px-6 py-3 font-semibold text-[var(--sea)] shadow-lg transition hover:bg-[var(--sand)]">Browse all homes</Link>
                <Link href="/search" className="rounded-full px-6 py-3 font-semibold text-white ring-1 ring-white/60 transition hover:bg-white/10">Check availability</Link>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-6 right-5 hidden items-center sm:flex gap-3 text-xs font-medium tracking-[0.2em] text-white/85 sm:right-10 md:right-16">
              <span ref={counterRef}>01 / {String(N).padStart(2, "0")}</span>
              <span className="relative block h-px w-16 overflow-hidden bg-white/30">
                <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-white" />
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
