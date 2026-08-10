import Link from "next/link";
import { brand } from "@/lib/content";

const footerLinks = [
  { href: "/homes", label: "Our Homes" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/central-oregon", label: "Central Oregon" },
  { href: "/owners", label: "For Owners" },
  { href: "/policies", label: "Policies" },
];

export default function Footer({ subtitle }: { subtitle?: string }) {
  return (
    <footer className="mt-auto bg-[var(--sea-700)] text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-lg text-white">{brand.name}</div>
          <div className="text-sm text-white/60">{subtitle ?? brand.tagline}</div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {footerLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-white/75 transition hover:text-white">{l.label}</Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-4 text-xs text-white/50 sm:flex-row">
          <span>© {brand.name}. All rights reserved.</span>
          <span className="flex gap-4">
            {brand.phone && <a href={`tel:${brand.phone}`} className="hover:text-white">{brand.phone}</a>}
            {brand.email && <a href={`mailto:${brand.email}`} className="hover:text-white">{brand.email}</a>}
          </span>
        </div>
      </div>
    </footer>
  );
}
