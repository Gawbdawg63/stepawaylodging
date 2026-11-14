"use client";

import Image from "next/image";
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

// Timing of the tour, in seconds.
const HOME_SECONDS = 3.6; // how long each home is on screen
const BLEND_SECONDS = 0.9; // the zoom-through from one home into the next

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const backOut = (x: number) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

// Camera moves alternate so the tour feels like turning from home to home:
// [centre x, centre y, zoom] at the start and end of each home (0–1 of the photo).
const CAMERAS: [number[], number[]][] = [
  [[0.44, 0.55, 1.0], [0.54, 0.51, 1.1]],
  [[0.58, 0.52, 1.0], [0.46, 0.5, 1.1]],
  [[0.5, 0.56, 1.0], [0.5, 0.5, 1.12]],
];

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
  const cueRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const replayRef = useRef<HTMLButtonElement>(null);

  // Play only in the browser, and not for visitors who ask for reduced motion.
  const motionOk = useSyncExternalStore(subscribeMotion, () => !REDUCED().matches, () => false);
  const animated = motionOk && N > 1;

  useEffect(() => {
    if (!animated) return;
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const g = canvas.getContext("2d")!;
    let W = 0, H = 0;
    const STEP = HOME_SECONDS - BLEND_SECONDS;
    const TOTAL = (N - 1) * STEP + HOME_SECONDS; // last home holds under the end card
    const PLAY_END = TOTAL + 1.5; // keep running so the end card finishes popping in

    // Load the original photos, not re-compressed copies: the tour is full screen, so every pixel counts.
    const imgs = homes.map((h) => {
      const im = new window.Image();
      im.decoding = "async";
      im.src = `/${h.photo}`;
      im.onload = () => draw(t);
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

    // One "pop" for a word or chip: grows in with a little overshoot, then fades out at the end of its home.
    function pop(el: HTMLElement, local: number, delay: number, out: number) {
      const k = clamp((local - delay) / 0.5);
      const o = Math.min(clamp((local - delay) / 0.25), out);
      const s = k > 0 ? 0.6 + 0.4 * backOut(k) : 0.6;
      el.style.opacity = String(o);
      el.style.transform = `translateY(${(1 - k) * 16}px) scale(${s})`;
    }

    // t = seconds since the tour started.
    function draw(t: number) {
      if (!W) return;
      g.fillStyle = "#0b2a2b";
      g.fillRect(0, 0, W, H);
      const i = Math.min(N - 1, Math.floor(t / STEP));
      const local = t - i * STEP;
      const blend = i < N - 1 ? clamp((local - (HOME_SECONDS - BLEND_SECONDS)) / BLEND_SECONDS) : 0;
      const kMove = smooth(clamp(local / (i === N - 1 ? HOME_SECONDS + 2 : HOME_SECONDS)));
      shot(i, kMove, 1 + 0.1 * blend * blend, 1);
      if (blend > 0) shot(i + 1, 0, 1, smooth(blend));

      // Intro copy and search fade away as the tour begins; the tint lightens so the homes show.
      const intro = clamp(1 - t / 0.8);
      const el = introRef.current!;
      el.style.opacity = String(intro);
      el.style.transform = `translateY(${(1 - intro) * -30}px)`;
      el.style.pointerEvents = intro > 0.6 ? "auto" : "none";
      el.style.visibility = intro <= 0 ? "hidden" : "visible";
      if (cueRef.current) cueRef.current.style.opacity = String(intro);
      tintRef.current!.style.opacity = String(0.3 + 0.7 * intro);

      // Words pop up for the home on screen.
      cardRefs.current.forEach((card, j) => {
        if (!card) return;
        const start = j * STEP;
        const lt = t - start;
        const visible = t > 0.4 && lt > -0.1 && lt < HOME_SECONDS;
        card.style.visibility = visible ? "visible" : "hidden";
        if (!visible) return;
        const out = j === N - 1 ? clamp((TOTAL - 0.4 - t) / 0.3) : clamp((HOME_SECONDS - BLEND_SECONDS - lt) / 0.3);
        const parts = card.querySelectorAll<HTMLElement>("[data-pop]");
        parts.forEach((p) => pop(p, lt, parseFloat(p.dataset.pop!) + (j === 0 ? 0.5 : 0.25), out));
        card.style.pointerEvents = out > 0.6 && lt > 1 ? "auto" : "none";
      });

      const end = clamp((t - (TOTAL - 0.5)) / 0.5);
      const endEl = endRef.current!;
      endEl.style.opacity = String(end);
      endEl.style.pointerEvents = end > 0.6 ? "auto" : "none";
      endEl.style.visibility = end <= 0 ? "hidden" : "visible";
      endEl.querySelectorAll<HTMLElement>("[data-pop]").forEach((p) => pop(p, t - (TOTAL - 0.5), parseFloat(p.dataset.pop!), 1));
    }

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = "high";
      draw(t);
    }

    // Playback: starts on the visitor's first scroll, pauses while the hero is off screen.
    let t = 0, playing = false, started = false, last = 0, raf = 0, onScreen = true;
    const frame = (now: number) => {
      t = Math.min(PLAY_END, t + (last ? (now - last) / 1000 : 0));
      last = now;
      draw(t);
      if (t >= PLAY_END) { playing = false; raf = 0; replayRef.current?.removeAttribute("hidden"); return; }
      raf = requestAnimationFrame(frame);
    };
    const play = () => { if (playing || t >= PLAY_END || !onScreen) return; playing = true; last = 0; raf = requestAnimationFrame(frame); };
    const pause = () => { playing = false; cancelAnimationFrame(raf); raf = 0; };
    const start = () => {
      if (started) return;
      started = true;
      removeTriggers();
      play();
    };

    // The first scroll gesture at the top of the page starts the tour instead of moving the page.
    const atTop = () => window.scrollY < 8;
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 0 && atTop()) { e.preventDefault(); start(); } };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? 0; };
    const onTouchMove = (e: TouchEvent) => { if (atTop() && touchY - (e.touches[0]?.clientY ?? 0) > 8) { if (e.cancelable) e.preventDefault(); start(); } };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /INPUT|SELECT|TEXTAREA|BUTTON/.test(target.tagName)) return;
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key) && atTop()) { e.preventDefault(); start(); }
    };
    const onScroll = () => { if (!atTop()) start(); }; // e.g. scrollbar drags or jump links
    function removeTriggers() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && started) play(); else pause();
    }, { threshold: 0.25 });
    io.observe(section);

    const replay = () => { replayRef.current?.setAttribute("hidden", ""); t = 0; started = true; play(); };
    const replayBtn = replayRef.current;
    replayBtn?.addEventListener("click", replay);

    resize();
    window.addEventListener("resize", resize);
    if (!atTop()) start();
    return () => {
      removeTriggers();
      io.disconnect();
      pause();
      replayBtn?.removeEventListener("click", replay);
      window.removeEventListener("resize", resize);
    };
  }, [animated, homes, N]);

  const first = homes[0];

  return (
    <section ref={sectionRef} aria-label="Step Away Lodging homes" className="relative h-[100svh] min-h-[560px] overflow-hidden">
      {/* First home as a real image: fast first paint, and what shows without the animation */}
      <Image src={`/${first.photo}`} alt={`${first.name}, ${first.location}`} fill priority sizes="100vw" quality={90} className="object-cover" />
      <canvas ref={canvasRef} aria-hidden="true" className={`absolute inset-0 h-full w-full ${animated ? "" : "hidden"}`} />

      <div ref={tintRef} className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(165deg, rgba(11,42,43,0.72) 0%, rgba(15,56,57,0.5) 45%, rgba(20,73,74,0.72) 100%)" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Intro: the original hero copy and search */}
      <div ref={introRef} className="absolute inset-0 flex items-center justify-center">
        <div className="relative mx-auto max-w-3xl px-5 pt-24 text-center text-white">{children}</div>
      </div>

      {animated && (
        <>
          <div ref={cueRef} className="pointer-events-none absolute inset-x-0 bottom-24 flex flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-white/80 md:bottom-8">
            Scroll to take the tour
            <span className="block h-8 w-px animate-pulse bg-white/70" />
          </div>

          {homes.map((h, j) => (
            <div
              key={h.slug}
              ref={(el) => { cardRefs.current[j] = el; }}
              className="invisible absolute inset-x-0 bottom-28 px-5 text-center text-white sm:bottom-16 sm:left-10 sm:right-auto sm:px-0 sm:text-left md:left-16"
              style={{ pointerEvents: "none" }}
            >
              <p data-pop="0" className="inline-block origin-bottom-left text-xs font-semibold uppercase tracking-[0.28em] text-white/85 opacity-0 drop-shadow">{h.location}</p>
              <h2 className="mt-2 font-display text-4xl leading-tight drop-shadow-lg sm:text-5xl md:text-6xl">
                {h.name.split(" ").map((w, k) => (
                  <span key={k} data-pop={String(0.12 + k * 0.1)} className="inline-block origin-bottom opacity-0">{w}&nbsp;</span>
                ))}
              </h2>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {[`Sleeps ${h.sleeps}`, `${h.bedrooms} bd`, `${num(h.bathrooms)} ba`, "Hot tub"].map((chip, k) => (
                  <span key={chip} data-pop={String(0.45 + k * 0.1)} className="inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium opacity-0 ring-1 ring-white/30 backdrop-blur">{chip}</span>
                ))}
              </div>
              <Link data-pop="0.9" href={`/homes/${h.slug}`} className="mt-5 inline-block origin-left rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--sea)] opacity-0 shadow-lg transition-colors hover:bg-[var(--sand)]">
                View home →
              </Link>
            </div>
          ))}

          <div ref={endRef} className="invisible absolute inset-0 flex flex-col items-center justify-center bg-[rgba(11,42,43,0.55)] px-5 text-center text-white opacity-0">
            <p data-pop="0" className="inline-block text-sm font-medium uppercase tracking-[0.28em] text-white/75">{N} homes · each with a hot tub</p>
            <h2 data-pop="0.12" className="mt-3 inline-block font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">Find your stay</h2>
            <div data-pop="0.3" className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/homes" className="rounded-full bg-white px-6 py-3 font-semibold text-[var(--sea)] shadow-lg transition hover:bg-[var(--sand)]">Browse all homes</Link>
              <Link href="/search" className="rounded-full px-6 py-3 font-semibold text-white ring-1 ring-white/60 transition hover:bg-white/10">Check availability</Link>
            </div>
            <button ref={replayRef} hidden type="button" className="mt-6 text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline">↻ Replay the tour</button>
          </div>
        </>
      )}
    </section>
  );
}
