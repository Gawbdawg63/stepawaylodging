"use client";

import { useState } from "react";
import { brand } from "@/lib/content";

export default function EmailSignup() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">Stay in the loop</p>
        <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">First dibs on open dates</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--foreground)]/80">
          Join our list for early access to open weekends, seasonal deals, and a few local tips for the Oregon Coast. No spam — just the good stuff.
        </p>

        {status === "done" ? (
          <p className="mt-8 text-lg font-medium text-[var(--sea)]">You&apos;re on the list — talk soon!</p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="signup-email" className="sr-only">Email address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full rounded-full border border-[var(--border)] bg-white px-5 py-3.5 text-[var(--foreground)] outline-none transition focus:border-[var(--sea)] focus:ring-2 focus:ring-[var(--sea-100)]"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="shrink-0 rounded-full bg-[var(--sea)] px-7 py-3.5 font-semibold text-white transition hover:bg-[var(--sea-700)] disabled:opacity-60"
            >
              {status === "sending" ? "Joining…" : "Join"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">Something went wrong. Please try again, or email us at {brand.email}.</p>
        )}
      </div>
    </section>
  );
}
