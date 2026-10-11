import Link from "next/link";

// A persistent "Check availability" button on phones, where most travelers browse.
export default function MobileCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 px-4 pt-3 backdrop-blur md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <Link
        href="/homes#search"
        className="block rounded-full bg-[var(--sea)] px-6 py-3.5 text-center font-semibold text-white shadow-sm"
      >
        Check availability
      </Link>
    </div>
  );
}
