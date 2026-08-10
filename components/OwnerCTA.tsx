"use client";

import { useState } from "react";
import { brand, owners } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

export default function OwnerCTA() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // No form service configured yet → fall back to opening the email app.
    if (!owners.formEndpoint) {
      const subject = encodeURIComponent("Property management inquiry — Step Away Lodging");
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n` +
          `Property location: ${data.location}\n\n${data.message}`
      );
      const to = brand.email || "";
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(owners.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _subject: "New property management lead — Step Away Lodging" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="owners" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Pitch */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sand-600)]">
              {owners.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl text-[var(--sea)] sm:text-4xl">
              {owners.heading}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--foreground)]/85">
              {owners.subhead}
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {owners.valueProps.map((v) => (
                <div key={v.title} className="flex gap-3">
                  <svg className="mt-1 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-[var(--sea)]">{v.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead form */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 shadow-sm sm:p-9">
            {status === "success" ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sea-100)] text-[var(--sea)]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <h3 className="font-display text-2xl text-[var(--sea)]">Thank you!</h3>
                <p className="mt-2 text-[var(--muted)]">
                  We&apos;ve got your details and will reach out shortly about managing your home.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl text-[var(--sea)]">List your home with us</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Tell us about your place and we&apos;ll be in touch. No obligation.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <Field name="name" label="Your name" type="text" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field name="email" label="Email" type="email" required />
                    <Field name="phone" label="Phone" type="tel" />
                  </div>
                  <Field name="location" label="Where is your property?" type="text" placeholder="City / area" />
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-[var(--foreground)]/80">
                      Anything else? <span className="text-[var(--muted)]">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--sea)] focus:ring-2 focus:ring-[var(--sea-100)]"
                      placeholder="Bedrooms, location, current rental status…"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-600">
                      Something went wrong. Please try again, or email us directly
                      {brand.email ? ` at ${brand.email}` : ""}.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full rounded-full bg-[var(--sea)] px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[var(--sea-700)] disabled:opacity-60"
                  >
                    {status === "submitting" ? "Sending…" : "Request a call"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-[var(--foreground)]/80">
        {label} {required && <span className="text-[var(--sand-600)]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--sea)] focus:ring-2 focus:ring-[var(--sea-100)]"
      />
    </div>
  );
}
