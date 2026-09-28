"use client";

import { useState } from "react";

type Lead = {
  id: string;
  email: string;
  firstName: string;
  property: string;
  city: string;
  status: string;
  step: number;
  nextSendAt: string;
  lastError?: string;
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-[var(--sea-100)] text-[var(--sea)]",
  replied: "bg-green-100 text-green-800",
  unsubscribed: "bg-gray-200 text-gray-600",
  done: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-700",
};

export default function OutreachAdmin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [importText, setImportText] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(pw = password) {
    setBusy(true);
    try {
      const res = await fetch(`/api/outreach/leads?password=${encodeURIComponent(pw)}`);
      if (!res.ok) { setMsg("Wrong password."); setBusy(false); return false; }
      const data = await res.json();
      setLeads(data.leads || []);
      setCounts(data.counts || {});
      setAuthed(true);
      setMsg("");
      return true;
    } finally {
      setBusy(false);
    }
  }

  async function doImport() {
    const rows = importText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [email, firstName, property, city] = line.split(/[\t,]/).map((s) => (s || "").trim());
        return { email, firstName, property, city };
      })
      .filter((r) => r.email && /@/.test(r.email) && !/^email/i.test(r.email));
    if (!rows.length) { setMsg("Paste at least one line with an email address."); return; }
    setBusy(true);
    const res = await fetch("/api/outreach/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password, action: "import", rows }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setMsg(data.error || "Import failed."); return; }
    setMsg(`Added ${data.added} new lead${data.added === 1 ? "" : "s"}.`);
    setImportText("");
    load();
  }

  async function update(id: string, status: string) {
    setBusy(true);
    await fetch("/api/outreach/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password, action: "update", id, changes: { status } }),
    });
    setBusy(false);
    load();
  }

  async function runNow() {
    setBusy(true);
    setMsg("Sending today's batch…");
    const res = await fetch(`/api/outreach/cron?password=${encodeURIComponent(password)}`, { method: "POST" });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setMsg(data.error || "Run failed."); return; }
    setMsg(data.skipped ? `Nothing sent — ${data.skipped}` : `Sent ${data.sent} email${data.sent === 1 ? "" : "s"}.`);
    load();
  }

  const input = "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-[var(--sea)] focus:ring-2 focus:ring-[var(--sea-100)]";

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-5 py-24">
        <h1 className="font-display text-2xl text-[var(--sea)]">Outreach admin</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Enter the admin password.</p>
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="mt-5 space-y-3">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={input} autoFocus />
          <button disabled={busy} className="w-full rounded-full bg-[var(--sea)] px-6 py-3 font-semibold text-white disabled:opacity-60">Enter</button>
        </form>
        {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-[var(--sea)]">Owner outreach</h1>
        <button onClick={runNow} disabled={busy} className="rounded-full bg-[var(--sand)] px-6 py-2.5 font-semibold text-white transition hover:bg-[var(--sand-600)] disabled:opacity-60">
          Send today&apos;s batch now
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {["total", "active", "replied", "unsubscribed", "done"].map((k) => (
          <span key={k} className="rounded-full border border-[var(--border)] bg-white px-4 py-1.5">
            <b className="text-[var(--sea)]">{counts[k] || 0}</b> <span className="text-[var(--muted)]">{k}</span>
          </span>
        ))}
      </div>

      {msg && <p className="mt-4 rounded-xl bg-[var(--sea-100)] px-4 py-2.5 text-sm text-[var(--sea)]">{msg}</p>}

      {/* Import */}
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-6">
        <h2 className="font-display text-xl text-[var(--sea)]">Add leads</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">One per line: <code>email, first name, property, city</code> (name/property/city optional). Duplicates are skipped.</p>
        <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={5} placeholder={"jane@example.com, Jane, Sea Breeze Cottage, Lincoln City\njohn@example.com, John, , Depoe Bay"} className={`${input} mt-3 font-mono text-sm`} />
        <button onClick={doImport} disabled={busy} className="mt-3 rounded-full bg-[var(--sea)] px-6 py-2.5 font-semibold text-white disabled:opacity-60">Add leads</button>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border)] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--border)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Sent</th>
              <th className="px-4 py-3 font-medium">Next</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[var(--muted)]">No leads yet — add some above.</td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3">{l.email}{l.lastError && <span className="block text-xs text-red-600">{l.lastError}</span>}</td>
                <td className="px-4 py-3">{l.firstName || "—"}</td>
                <td className="px-4 py-3">{l.city || "—"}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[l.status] || ""}`}>{l.status}</span></td>
                <td className="px-4 py-3">{l.step}/5</td>
                <td className="px-4 py-3 text-[var(--muted)]">{l.status === "active" ? new Date(l.nextSendAt).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 text-xs">
                    {l.status === "active" && <button onClick={() => update(l.id, "replied")} className="rounded-full border border-[var(--border)] px-2.5 py-1 hover:border-[var(--sea)]">Stop</button>}
                    {l.status !== "unsubscribed" && <button onClick={() => update(l.id, "unsubscribed")} className="rounded-full border border-[var(--border)] px-2.5 py-1 hover:border-[var(--sea)]">Unsub</button>}
                    {l.status !== "active" && <button onClick={() => update(l.id, "active")} className="rounded-full border border-[var(--border)] px-2.5 py-1 hover:border-[var(--sea)]">Resume</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
