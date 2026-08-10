import Link from "next/link";
import { brand } from "@/lib/content";

export default function Footer({ subtitle }: { subtitle?: string }) {
  return (
    <footer className="mt-auto bg-[var(--sea-700)] text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
        <div>
          <div className="font-display text-lg text-white">{brand.name}</div>
          <div className="text-sm text-white/60">{subtitle ?? brand.tagline}</div>
        </div>
        <div className="flex flex-col items-center gap-1 text-sm sm:items-end">
          {brand.phone && <a href={`tel:${brand.phone}`} className="hover:text-white">{brand.phone}</a>}
          {brand.email && <a href={`mailto:${brand.email}`} className="hover:text-white">{brand.email}</a>}
          <Link href="/#homes" className="text-[var(--sand)] hover:text-white">Browse our homes →</Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-4 text-center text-xs text-white/50">
          © {brand.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
