"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function InquiryForm({
  propertyName,
  maxGuests,
  formEndpoint,
  email,
}: {
  propertyName: string;
  maxGuests: number;
  formEndpoint: string;
  email: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!formEndpoint) {
      const subject = encodeURIComponent(`Inquiry: ${propertyName}`);
      const body = encodeURIComponent(
        `Home: ${propertyName}\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n` +
          `Check-in: ${data.arrival}\nCheck-out: ${data.departure}\nGuests: ${data.guests}\n\n${data.message}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _subject: `Website inquiry — ${propertyName}`, home: propertyName }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sea-100)] text-[var(--sea)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h3 className="font-display text-2xl text-[var(--sea)]">Thanks — we&apos;ll be in touch!</h3>
        <p className="mt-2 text-[var(--muted)]">We&apos;ve got your inquiry about {propertyName} and will reply soon.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-left shadow-sm sm:p-8">
      <h3 className="text-center font-display text-2xl text-[var(--sea)]">Have a question? Send an inquiry</h3>
      <p className="mx-auto mt-2 max-w-md text-center text-sm text-[var(--muted)]">
        Ask us anything about {propertyName} and we&apos;ll get right back to you.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Your name" type="text" required />
          <Field name="email" label="Email" type="email" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field name="arrival" label="Check in" type="date" min={today} />
          <Field name="departure" label="Check out" type="date" min={today} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]/80">Guests</span>
            <select name="guests" defaultValue="2" className="fld">
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]/80">Message</span>
          <textarea name="message" rows={4} required placeholder="Your question or anything we should know…" className="fld" />
        </label>

        {status === "error" && (
          <p className="text-sm text-red-600">Something went wrong — please try again{email ? `, or email us at ${email}` : ""}.</p>
        )}

        <button type="submit" disabled={status === "submitting"} className="w-full rounded-full bg-[var(--sea)] px-6 py-3.5 font-semibold text-white transition hover:bg-[var(--sea-700)] disabled:opacity-60">
          {status === "submitting" ? "Sending…" : "Send inquiry"}
        </button>
      </form>
      <style>{`.fld{width:100%;border:1px solid var(--border);border-radius:.75rem;padding:.65rem .8rem;background:#fff;color:var(--foreground);outline:none}.fld:focus{border-color:var(--sea);box-shadow:0 0 0 2px var(--sea-100)}`}</style>
    </div>
  );
}

function Field({ name, label, type, required, min }: { name: string; label: string; type: string; required?: boolean; min?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]/80">
        {label} {required && <span className="text-[var(--sand-600)]">*</span>}
      </span>
      <input name={name} type={type} required={required} min={min} className="fld" />
    </label>
  );
}
