"use client";

import { useEffect, useState } from "react";
import { brand, owners } from "@/lib/content";

/**
 * Owner "welcome portal" — a new owner fills in everything we need to build
 * their listing (photos optional). Submits to the same Formspree endpoint as
 * the owner lead form, so it lands in stay@stepawaylodging.com. Progress is
 * auto-saved to the browser so a long form isn't lost on refresh.
 */

type Kind = "text" | "email" | "tel" | "url" | "date" | "number" | "textarea" | "select" | "checkgroup";
type FieldDef = {
  name: string;
  label: string;
  kind: Kind;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  help?: string;
  full?: boolean; // span both columns
};
type SectionDef = { id: string; title: string; desc?: string; fields: FieldDef[] };

const SECTIONS: SectionDef[] = [
  {
    id: "you",
    title: "About you",
    desc: "So we know who we're working with and how to reach you.",
    fields: [
      { name: "ownerName", label: "Your name", kind: "text", required: true },
      { name: "coOwner", label: "Co-owner name", kind: "text", placeholder: "If the home is co-owned" },
      { name: "email", label: "Email", kind: "email", required: true },
      { name: "phone", label: "Phone", kind: "tel" },
      { name: "preferredContact", label: "Preferred way to reach you", kind: "select", options: ["Email", "Phone call", "Text"] },
      { name: "mailingAddress", label: "Mailing address", kind: "text", placeholder: "For owner statements & mail", full: true },
    ],
  },
  {
    id: "property",
    title: "The property",
    desc: "The basics about the home itself. The street address stays private — it's only for management.",
    fields: [
      { name: "propertyName", label: "Home name", kind: "text", placeholder: "If it has one — we can help name it", full: true },
      { name: "streetAddress", label: "Street address", kind: "text", placeholder: "123 Beach Ave (kept private)", full: true },
      { name: "city", label: "City / town", kind: "text", required: true, placeholder: "e.g. Lincoln City" },
      { name: "state", label: "State", kind: "text", placeholder: "OR" },
      { name: "propertyType", label: "Property type", kind: "select", options: ["House", "Condo", "Townhome", "Cottage", "Cabin", "Suite / studio", "Apartment", "Other"] },
      { name: "yearBuilt", label: "Year built", kind: "text", placeholder: "Optional" },
      { name: "squareFeet", label: "Approx. square footage", kind: "text", placeholder: "Optional" },
    ],
  },
  {
    id: "layout",
    title: "Layout & capacity",
    fields: [
      { name: "maxGuests", label: "Max guests it sleeps", kind: "number" },
      { name: "bedrooms", label: "Bedrooms", kind: "number" },
      { name: "bathrooms", label: "Bathrooms", kind: "text", placeholder: "e.g. 2.5" },
      { name: "beds", label: "Beds — types & counts", kind: "textarea", full: true, placeholder: "e.g. 1 King (primary), 1 Queen, 2 Twins, 1 Queen sofa bed in living room" },
      { name: "parking", label: "Parking", kind: "text", full: true, placeholder: "e.g. Driveway for 2 cars + garage; street parking available" },
    ],
  },
  {
    id: "amenities",
    title: "Amenities",
    desc: "Check everything the home has. This becomes the listing's amenity list.",
    fields: [
      {
        name: "amenities",
        label: "Amenities",
        kind: "checkgroup",
        full: true,
        options: [
          "Hot tub", "Ocean view", "Oceanfront / beachfront", "Steps to the beach", "Wi-Fi",
          "Smart TV / streaming", "Fireplace", "Fire pit", "Private deck / patio", "BBQ grill",
          "Full kitchen", "Dishwasher", "Washer & dryer", "Air conditioning", "Heating",
          "EV charger", "Garage", "Elevator", "Single level / no stairs", "Wheelchair accessible",
          "Crib / pack-n-play", "High chair", "Community pool", "Gym access", "Games / entertainment",
          "Outdoor shower", "Beach gear provided", "Pet-friendly",
        ],
      },
      { name: "otherAmenities", label: "Other amenities or standout features", kind: "textarea", full: true, placeholder: "Anything not listed above" },
    ],
  },
  {
    id: "rules",
    title: "Pets & house rules",
    fields: [
      { name: "petsAllowed", label: "Pets allowed?", kind: "select", options: ["No", "Yes", "Case-by-case"] },
      { name: "petDetails", label: "Pet details", kind: "text", placeholder: "e.g. 1 dog, 50 lb limit, $50 pet fee" },
      { name: "smoking", label: "Smoking", kind: "select", options: ["No smoking", "Outside only", "Allowed"] },
      { name: "maxOccupancy", label: "Max occupancy / events policy", kind: "text", placeholder: "e.g. No parties or events; max 10 overnight" },
      { name: "quietHours", label: "Quiet hours", kind: "text", placeholder: "e.g. 10pm – 8am" },
      { name: "houseRules", label: "Any other house rules", kind: "textarea", full: true },
    ],
  },
  {
    id: "operations",
    title: "Access & operations",
    desc: "The practical details we'll need to manage the home and guide guests.",
    fields: [
      { name: "entryMethod", label: "Guest entry", kind: "text", full: true, placeholder: "e.g. Smart lock keypad; lockbox on front door" },
      { name: "wifiNetwork", label: "Wi-Fi network name", kind: "text" },
      { name: "wifiPassword", label: "Wi-Fi password", kind: "text" },
      { name: "trashDay", label: "Trash / recycling day", kind: "text" },
      { name: "hotTubService", label: "Hot tub service / notes", kind: "text", placeholder: "Who services it, quirks, etc." },
      { name: "hoaRules", label: "HOA or community rules", kind: "textarea", full: true, placeholder: "Parking limits, pool hours, gate codes, etc." },
      { name: "specialInstructions", label: "Anything quirky we should know", kind: "textarea", full: true, placeholder: "Finicky heater, tricky door, well water — anything!" },
      { name: "emergencyContact", label: "Local emergency / maintenance contact", kind: "text", full: true, placeholder: "A handy neighbor, plumber, etc. (optional)" },
    ],
  },
  {
    id: "story",
    title: "About the home & area",
    desc: "This helps us write a listing that sells. Don't worry about polish — we'll shape it.",
    fields: [
      { name: "highlights", label: "What makes this home special?", kind: "textarea", full: true, placeholder: "The view, the light, a favorite spot on the deck, why guests love it…" },
      { name: "area", label: "What's nearby?", kind: "textarea", full: true, placeholder: "Beach access, restaurants, attractions, walking distance to…" },
      {
        name: "bestFor",
        label: "This home is great for…",
        kind: "checkgroup",
        full: true,
        options: ["Couples", "Families", "Large groups", "Pet owners", "Remote workers", "Accessibility needs"],
      },
    ],
  },
  {
    id: "booking",
    title: "Booking & management",
    fields: [
      { name: "currentlyListed", label: "Currently listed anywhere?", kind: "select", options: ["Not listed yet", "Airbnb", "Vrbo", "OwnerRez", "Other / multiple"] },
      { name: "listingLinks", label: "Existing listing link(s)", kind: "text", placeholder: "Paste any current listing URLs" },
      { name: "desiredRate", label: "Nightly rate expectations", kind: "text", placeholder: "Optional — we'll advise" },
      { name: "minStay", label: "Minimum-stay preference", kind: "text", placeholder: "e.g. 2 nights, 3 on holidays" },
      { name: "availabilityStart", label: "Available to start renting", kind: "date" },
      { name: "turnoverNotes", label: "Cleaning / turnover notes", kind: "textarea", full: true, placeholder: "Current cleaner, linen setup, storage for supplies…" },
    ],
  },
  {
    id: "photos",
    title: "Photos",
    desc: "Optional, but photos help us launch faster. Paste a link to a folder — Google Drive, Dropbox, Google Photos, anything.",
    fields: [
      { name: "photosLink", label: "Link to your photos", kind: "url", full: true, placeholder: "https://drive.google.com/… or https://photos.app.goo.gl/…" },
      { name: "photosNote", label: "Notes about the photos", kind: "text", full: true, placeholder: "e.g. Taken last summer; happy to have new ones shot" },
    ],
  },
  {
    id: "extra",
    title: "Anything else",
    fields: [
      { name: "notes", label: "Anything else you'd like us to know?", kind: "textarea", full: true },
    ],
  },
];

const STORAGE_KEY = "sal-listing-intake-v1";
type FormState = Record<string, string | string[]>;
type Status = "idle" | "submitting" | "success" | "error";

export default function ListingIntakeForm() {
  const [form, setForm] = useState<FormState>({});
  const [status, setStatus] = useState<Status>("idle");
  const [restored, setRestored] = useState(false);

  // Restore saved progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm(JSON.parse(raw));
    } catch {}
    setRestored(true);
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form, restored]);

  const set = (name: string, value: string | string[]) => setForm((f) => ({ ...f, [name]: value }));
  const toggle = (name: string, option: string) =>
    setForm((f) => {
      const cur = Array.isArray(f[name]) ? (f[name] as string[]) : [];
      return { ...f, [name]: cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option] };
    });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Build a readable, labeled payload for the email.
    const payload: Record<string, string> = {};
    for (const section of SECTIONS) {
      for (const field of section.fields) {
        const v = form[field.name];
        const str = Array.isArray(v) ? v.join(", ") : (v ?? "");
        if (str) payload[field.label] = str;
      }
    }
    const who = (form.propertyName as string) || (form.city as string) || (form.ownerName as string) || "New owner";

    if (!owners.formEndpoint) {
      const body = encodeURIComponent(Object.entries(payload).map(([k, v]) => `${k}: ${v}`).join("\n"));
      window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(`New home intake — ${who}`)}&body=${body}`;
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(owners.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, _subject: `New home intake — ${who}` }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--sea-100)] text-[var(--sea)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h2 className="font-display text-3xl text-[var(--sea)]">Thank you — we've got it!</h2>
        <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-[var(--foreground)]/80">
          Your home details are on their way to our team. We&apos;ll review everything and reach out to finalize your
          listing and next steps. If you have photos to add later, just email us at {brand.email}.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--sea)] focus:ring-2 focus:ring-[var(--sea-100)]";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-5 pb-24">
      {SECTIONS.map((section, i) => (
        <section key={section.id} className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-lg text-[var(--sand-600)]">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="font-display text-2xl text-[var(--sea)]">{section.title}</h2>
            </div>
            {section.desc && <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{section.desc}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {section.fields.map((field) => {
              const value = form[field.name];
              const labelEl = (
                <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-[var(--foreground)]/80">
                  {field.label} {field.required && <span className="text-[var(--sand-600)]">*</span>}
                  {!field.required && field.kind !== "checkgroup" && <span className="ml-1 text-xs text-[var(--muted)]">(optional)</span>}
                </label>
              );

              if (field.kind === "checkgroup") {
                const sel = Array.isArray(value) ? value : [];
                return (
                  <div key={field.name} className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-[var(--foreground)]/80">{field.label}</span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {field.options!.map((opt) => (
                        <label key={opt} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition ${sel.includes(opt) ? "border-[var(--sea)] bg-[var(--sea-100)] text-[var(--sea)]" : "border-[var(--border)] bg-white text-[var(--foreground)]/80 hover:border-[var(--sea)]/40"}`}>
                          <input type="checkbox" checked={sel.includes(opt)} onChange={() => toggle(field.name, opt)} className="h-4 w-4 accent-[var(--sea)]" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
                  {labelEl}
                  {field.kind === "textarea" ? (
                    <textarea id={field.name} name={field.name} rows={3} value={(value as string) || ""} placeholder={field.placeholder} onChange={(e) => set(field.name, e.target.value)} className={inputCls} />
                  ) : field.kind === "select" ? (
                    <select id={field.name} name={field.name} value={(value as string) || ""} onChange={(e) => set(field.name, e.target.value)} className={inputCls}>
                      <option value="">Select…</option>
                      {field.options!.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input id={field.name} name={field.name} type={field.kind} required={field.required} value={(value as string) || ""} placeholder={field.placeholder} onChange={(e) => set(field.name, e.target.value)} className={inputCls} />
                  )}
                  {field.help && <p className="mt-1 text-xs text-[var(--muted)]">{field.help}</p>}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {status === "error" && (
        <p className="mt-6 text-center text-sm text-red-600">
          Something went wrong sending your form. Please try again, or email us directly at {brand.email}.
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <button type="submit" disabled={status === "submitting"} className="w-full max-w-md rounded-full bg-[var(--sea)] px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-[var(--sea-700)] disabled:opacity-60">
          {status === "submitting" ? "Sending…" : "Submit my home details"}
        </button>
        <p className="text-center text-xs text-[var(--muted)]">
          Your progress saves automatically in this browser. Only your name, email, and city are required — send us the rest as you have it.
        </p>
      </div>
    </form>
  );
}
