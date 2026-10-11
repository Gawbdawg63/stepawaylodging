"use client";

import { useEffect, useState } from "react";

type Sub = { id: string; email: string; firstName: string; status: string; source: string; addedAt: string; lastSentAt?: string };

export default function NewsletterPanel({ password }: { password: string }) {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [importText, setImportText] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function load() {
    const res = await fetch(`/api/newsletter?password=${encodeURIComponent(password)}`);
    if (!res.ok) return;
    const d = await res.json();
    setSubs(d.subscribers || []);
    setCounts(d.counts || {});
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function post(payload: Record<string, unknown>) {
    setBusy(true);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password, ...payload }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    return { res, d };
  }

  async function doAdd() {
    const rows = importText.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const [email, firstName] = l.split(/[\t,]/).map((s) => (s || "").trim());
      return { email, firstName };
    }).filter((r) => /@/.test(r.email));
    if (!rows.length) { setMsg("Paste at least one email."); return; }
    const { res, d } = await post({ action: "add", rows });
    setMsg(res.ok ? `Added ${d.added} subscriber${d.added === 1 ? "" : "s"}.` : d.error || "Failed.");
    setImportText(""); load();
  }

  async function update(id: string, status: string) {
    await post({ action: "update", id, changes: { status } });
    load();
  }

  async function sendTest() {
    if (!subject.trim() || !body.trim()) { setMsg("Add a subject and message first."); return; }
    const { res, d } = await post({ action: "send", subject, body, test: true });
    setMsg(res.ok ? `Test sent to ${d.testTo}. Check that inbox.` : d.error || "Failed.");
  }

  async function sendAll() {
    setConfirming(false);
    const { res, d } = await post({ action: "send", subject, body });
    if (!res.ok) { setMsg(d.error || "Failed."); return; }
    setMsg(d.skipped ? `Nothing sent — ${d.skipped}` : `Newsletter sent to ${d.sent} subscriber${d.sent === 1 ? "" : "s"}.`);
    load();
  }

  const input = "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-[var(--sea)] focus:ring-2 focus:ring-[var(--sea-100)]";
  const active = counts.active || 0;

  return (
    <div>
      <div className="flex flex-wrap gap-3 text-sm">
        {["total", "active", "unsubscribed"].map((k) => (
          <span key={k} className="rounded-full border border-[var(--border)] bg-white px-4 py-1.5">
            <b className="text-[var(--sea)]">{counts[k] || 0}</b> <span className="text-[var(--muted)]">{k}</span>
          </span>
        ))}
      </div>
      {msg && <p className="mt-4 rounded-xl bg-[var(--sea-100)] px-4 py-2.5 text-sm text-[var(--sea)]">{msg}</p>}

      {/* Compose */}
      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-6">
        <h2 className="font-display text-xl text-[var(--sea)]">Write a newsletter</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Goes to all {active} active subscribers. Use <code>{"{{first_name}}"}</code> to personalize. An unsubscribe link and your address are added automatically.</p>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject line" className={`${input} mt-4`} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} placeholder={"Hi {{first_name}},\n\nOpen weekends on the coast this month…\n\nWarmly,\nThe Step Away Lodging family"} className={`${input} mt-3`} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={sendTest} disabled={busy} className="rounded-full border border-[var(--sea)] px-5 py-2.5 font-semibold text-[var(--sea)] transition hover:bg-[var(--sea-100)] disabled:opacity-60">Send test to myself</button>
          {!confirming ? (
            <button onClick={() => setConfirming(true)} disabled={busy || active === 0} className="rounded-full bg-[var(--sand)] px-6 py-2.5 font-semibold text-white transition hover:bg-[var(--sand-600)] disabled:opacity-60">Send to all {active}</button>
          ) : (
            <span className="flex items-center gap-2 text-sm">
              <span className="text-[var(--foreground)]/80">Send to {active} people?</span>
              <button onClick={sendAll} disabled={busy} className="rounded-full bg-[var(--sea)] px-5 py-2 font-semibold text-white disabled:opacity-60">Yes, send</button>
              <button onClick={() => setConfirming(false)} className="rounded-full border border-[var(--border)] px-4 py-2">Cancel</button>
            </span>
          )}
        </div>
      </div>

      {/* Add subscribers */}
      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-6">
        <h2 className="font-display text-xl text-[var(--sea)]">Add subscribers</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Website signups land here automatically. To add your own: one per line, <code>email, first name</code> (name optional).</p>
        <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={4} placeholder={"jane@example.com, Jane\njohn@example.com"} className={`${input} mt-3 font-mono text-sm`} />
        <button onClick={doAdd} disabled={busy} className="mt-3 rounded-full bg-[var(--sea)] px-6 py-2.5 font-semibold text-white disabled:opacity-60">Add</button>
      </div>

      {/* List */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)] bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-[var(--border)] text-[var(--muted)]">
            <tr><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Source</th><th className="px-4 py-3 font-medium"></th></tr>
          </thead>
          <tbody>
            {subs.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">No subscribers yet.</td></tr>}
            {subs.map((s) => (
              <tr key={s.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{s.firstName || "—"}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>{s.status}</span></td>
                <td className="px-4 py-3 text-[var(--muted)]">{s.source}</td>
                <td className="px-4 py-3 text-xs">
                  {s.status === "active"
                    ? <button onClick={() => update(s.id, "unsubscribed")} className="rounded-full border border-[var(--border)] px-2.5 py-1 hover:border-[var(--sea)]">Remove</button>
                    : <button onClick={() => update(s.id, "active")} className="rounded-full border border-[var(--border)] px-2.5 py-1 hover:border-[var(--sea)]">Re-add</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
