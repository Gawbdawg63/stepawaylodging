import Link from "next/link";
import { brand } from "@/lib/content";

const footerLinks = [
  { href: "/homes", label: "Our Homes" },
  { href: "/our-story", label: "Our Story" },
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
          <div className="mt-3 flex gap-3">
            {brand.social.facebook && (
              <a href={brand.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" /></svg>
              </a>
            )}
            {brand.social.instagram && (
              <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
            )}
            {brand.social.pinterest && (
              <a href={brand.social.pinterest} target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.3 2C6.8 2 4 5.6 4 9c0 2 .8 3.8 2.4 4.5.3.1.5 0 .6-.3l.2-.9c.1-.3 0-.4-.2-.6-.5-.6-.8-1.3-.8-2.4 0-3 2.3-5.7 5.9-5.7 3.2 0 5 2 5 4.6 0 3.5-1.5 6.4-3.8 6.4-1.3 0-2.2-1-1.9-2.3.3-1.5 1-3 1-4.1 0-.9-.5-1.7-1.6-1.7-1.3 0-2.3 1.3-2.3 3.1 0 1.1.4 1.9.4 1.9l-1.5 6.4c-.4 1.9-.1 4.2 0 4.4 0 .2.3.2.4.1.1-.2 1.8-2.6 2.3-4.5l.9-3.4c.4.8 1.6 1.5 2.9 1.5 3.8 0 6.4-3.5 6.4-8.1C20.5 5 16.9 2 12.3 2Z" /></svg>
              </a>
            )}
          </div>
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
