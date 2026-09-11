"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

// A private page for watching the inquiry robot without a terminal.
//
// Everything here is read-only: the inbox check runs in dry-run mode, so it
// never sends, drafts, or marks anything read, and the email tester never
// touches the mailbox at all. The access key is held only in this tab.

type Outcome = {
  messageId: string;
  subject: string;
  guest: string | null;
  action: "quoted" | "offered-alternatives" | "needs-review" | "blocked" | "error";
  slug?: string | null;
  arrival?: string | null;
  departure?: string | null;
  total?: number;
  missing?: string[];
  error?: string;
  html?: string;
  excerpt?: string;
  bookUrl?: string;
  links?: { field: string; url: string }[];
  quoteFields?: { field: string; value: string }[];
};

type ScanResult = { scanned: number; autoSend: boolean; results: Outcome[] };

type Parsed = {
  guestName: string | null;
  guestEmail: string | null;
  slug: string | null;
  arrival: string | null;
  departure: string | null;
  adults: number;
  missing: string[];
};

type PreviewResult = { parsed: Parsed; wouldSend: boolean; available?: boolean; reason?: string; html: string };

const KEY = "sal-inquiry-key";

// The key lives in localStorage so it survives a reload, a new tab and a
// closed browser — several people use this page and none of them should have
// to retype a 64-character key. "Lock" clears it. Read through
// useSyncExternalStore rather than an effect: the server has no localStorage,
// and this keeps the two in step without a render-triggering setState.
const listeners = new Set<() => void>();

function readKey(): string {
  try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; }
}

function writeKey(value: string) {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((notify) => notify());
}

function subscribeKey(notify: () => void) {
  listeners.add(notify);
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
}

export default function InquiryAdmin() {
  const key = useSyncExternalStore(subscribeKey, readKey, () => "");
  const [entry, setEntry] = useState("");

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    const k = entry.trim();
    if (k) writeKey(k);
  };

  const forget = useCallback(() => {
    writeKey("");
    setEntry("");
  }, []);

  if (!key) {
    return (
      <main className="mx-auto w-full max-w-md px-5 py-20">
        <h1 className="font-display text-3xl text-[var(--sea)]">Inquiry robot</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Enter your access key to see what the robot is doing. This browser remembers it until you
          press Lock.
        </p>
        <form onSubmit={unlock} className="mt-6 space-y-3">
          <input
            id="access-key"
            type="password"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Access key"
            autoComplete="off"
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--sea)]"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--sea)] px-4 py-3 font-medium text-white transition hover:bg-[var(--sea-700)]"
          >
            Unlock
          </button>
        </form>
        <p className="mt-5 text-xs text-[var(--muted)]">
          This is the <code>INQUIRY_JOB_SECRET</code> from your Vercel settings.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-[var(--sea)] sm:text-4xl">Inquiry robot</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Nothing on this page sends email. Both checks are previews.
          </p>
        </div>
        <button onClick={forget} className="text-sm text-[var(--muted)] underline underline-offset-2 hover:text-[var(--sea)]">
          Lock
        </button>
      </header>

      <InboxCheck accessKey={key} />
      <EmailTester accessKey={key} />
      <PropertyTokens accessKey={key} />
    </main>
  );
}

/* ---------------------------------------------------------------- inbox --- */

function InboxCheck({ accessKey }: { accessKey: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [data, setData] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/inquiries/process?dryRun=1", {
        headers: { "x-inquiry-secret": accessKey },
      });
      if (res.status === 401) {
        // Deliberately not signing out: being thrown back to a blank box, with
        // the key gone, is a worse answer than being told it is wrong.
        setError(
          "That access key was not accepted. Check INQUIRY_JOB_SECRET in Vercel, then press Lock at the top and enter it again."
        );
        setState("error");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? `The check failed (${res.status}).`);
        setState("error");
        return;
      }
      setData((await res.json()) as ScanResult);
      setState("done");
    } catch {
      setError("Could not reach the site. Check your connection and try again.");
      setState("error");
    }
  }, [accessKey]);

  return (
    <section className="mt-10 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-2xl text-[var(--sea)]">What&apos;s waiting in the inbox</h2>
      <p className="mt-1.5 text-sm text-[var(--muted)]">
        Reads unanswered Beachcombers NW inquiries from the last few days and shows what the robot
        would do with each one. It sends no email, writes no draft, and leaves every message unread —
        but it does create the quote in OwnerRez, which is how it knows the price.
      </p>

      <button
        onClick={run}
        disabled={state === "loading"}
        className="mt-5 rounded-xl bg-[var(--sea)] px-5 py-3 font-medium text-white transition hover:bg-[var(--sea-700)] disabled:opacity-60"
      >
        {state === "loading" ? "Checking…" : "Check the inbox"}
      </button>

      {state === "error" && <Problem>{error}</Problem>}

      {state === "done" && data && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
            <span>
              Found <strong className="text-[var(--foreground)]">{data.scanned}</strong>{" "}
              {data.scanned === 1 ? "inquiry" : "inquiries"}.
            </span>
            <span className={data.autoSend ? "text-[var(--sand-600)]" : ""}>
              {data.autoSend
                ? "Automatic sending is ON — real replies go out on the next run."
                : "Automatic sending is off — replies are saved as drafts."}
            </span>
          </div>

          {data.results.length === 0 ? (
            <p className="mt-4 rounded-xl bg-[var(--sea-100)] p-4 text-sm text-[var(--sea)]">
              Nothing unanswered right now. If you just sent yourself a test, make sure it has
              arrived and is still marked unread, then check again.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {data.results.map((r) => (
                <li key={r.messageId}>
                  <OutcomeCard outcome={r} accessKey={accessKey} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function OutcomeCard({ outcome, accessKey }: { outcome: Outcome; accessKey: string }) {
  const [open, setOpen] = useState(false);

  const tone =
    outcome.action === "quoted"
      ? { label: "Would send a quote", cls: "bg-[var(--sea-100)] text-[var(--sea)]" }
      : outcome.action === "offered-alternatives"
        ? { label: "Booked — would offer other homes", cls: "bg-[var(--sea-100)] text-[var(--sea)]" }
        : outcome.action === "needs-review"
          ? { label: "Needs you", cls: "bg-[#fdf1e0] text-[var(--sand-600)]" }
          : outcome.action === "blocked"
            ? { label: "Couldn't price it", cls: "bg-[#fbe9e9] text-[#9b3232]" }
            : { label: "Error", cls: "bg-[#fbe9e9] text-[#9b3232]" };

  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-[var(--foreground)]">{outcome.subject || "(no subject)"}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.cls}`}>{tone.label}</span>
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <Row label="Home" value={outcome.slug ?? "— not recognized —"} />
        <Row label="Guest" value={outcome.guest ?? "— not found —"} />
        <Row label="Arriving" value={outcome.arrival ?? "— not found —"} />
        <Row label="Leaving" value={outcome.departure ?? "— not found —"} />
        {typeof outcome.total === "number" && (
          <Row label="Total" value={`$${outcome.total.toLocaleString("en-US")}`} />
        )}
      </dl>

      {outcome.missing?.length ? (
        <p className="mt-3 rounded-lg bg-[#fdf1e0] p-3 text-sm text-[var(--sand-600)]">
          Couldn&apos;t read: {outcome.missing.join(", ")}. This one is left for you to answer.
        </p>
      ) : null}

      {outcome.links && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-[var(--sea)] underline underline-offset-2">
            Where &ldquo;Book these dates&rdquo; points
          </summary>
          <p className="mt-2 break-all text-xs text-[var(--muted)]">
            Using: <span className="text-[var(--foreground)]">{outcome.bookUrl ?? "the listing page (OwnerRez sent no link)"}</span>
          </p>
          {outcome.links.length > 0 && (
            <ul className="mt-2 space-y-1">
              {outcome.links.map((l) => (
                <li key={l.field} className="break-all text-xs text-[var(--muted)]">
                  <span className="font-mono text-[var(--foreground)]">{l.field}</span> — {l.url}
                </li>
              ))}
            </ul>
          )}
          {outcome.links.length === 0 && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              OwnerRez returned no link with this quote. Everything it <em>did</em> return is below —
              a payment form or booking token would show up here.
            </p>
          )}

          {outcome.quoteFields && outcome.quoteFields.length > 0 && (
            <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--sea-100)]/40 p-3 font-mono text-xs text-[var(--foreground)]">
              {outcome.quoteFields.map((f) => `${f.field}: ${f.value}`).join("\n")}
            </pre>
          )}

          <p className="mt-1.5 text-xs text-[var(--muted)]">
            Copy this and send it over — the right field can then be wired in.
          </p>
        </details>
      )}

      {outcome.excerpt && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-[var(--sea)] underline underline-offset-2">
            See what the email actually said
          </summary>
          <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--sea-100)]/40 p-3 font-mono text-xs text-[var(--foreground)]">
            {outcome.excerpt}
          </pre>
          <p className="mt-1.5 text-xs text-[var(--muted)]">
            Copy this and send it over — it shows exactly which wording the parser is missing.
          </p>
        </details>
      )}

      {outcome.error && (
        <p className="mt-3 rounded-lg bg-[#fbe9e9] p-3 text-sm text-[#9b3232]">{outcome.error}</p>
      )}

      {outcome.html && (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-3 text-sm text-[var(--sea)] underline underline-offset-2"
          >
            {open ? "Hide the reply" : "See the reply it would send"}
          </button>
          {open && <ReplyPreview html={outcome.html} />}
        </>
      )}

      {(outcome.action === "quoted" ||
        outcome.action === "offered-alternatives" ||
        outcome.action === "blocked") && (
        <SendControl messageId={outcome.messageId} to={outcome.guest} accessKey={accessKey} />
      )}
    </div>
  );
}

function SendControl({
  messageId,
  to,
  accessKey,
}: {
  messageId: string;
  to: string | null;
  accessKey: string;
}) {
  const [stage, setStage] = useState<"idle" | "confirm" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function send() {
    setStage("sending");
    setError("");
    try {
      const res = await fetch("/api/inquiries/send", {
        method: "POST",
        headers: { "x-inquiry-secret": accessKey, "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? `Could not send (${res.status}).`);
        setStage("error");
        return;
      }
      setStage("sent");
    } catch {
      setError("Could not reach the site. Nothing was sent.");
      setStage("error");
    }
  }

  if (stage === "sent") {
    return (
      <p className="mt-4 rounded-lg bg-[var(--sea-100)] p-3 text-sm font-medium text-[var(--sea)]">
        Sent to {to ?? "the guest"}. It&apos;s in your Sent Items, marked <em>Quoted by Step Away bot</em>.
      </p>
    );
  }

  return (
    <div className="mt-4 border-t border-[var(--border)] pt-4">
      {stage === "confirm" ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-[var(--foreground)]">
            Send this to <strong>{to ?? "the guest"}</strong>?
          </span>
          <button
            onClick={send}
            className="rounded-lg bg-[var(--sea)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--sea-700)]"
          >
            Yes, send it
          </button>
          <button
            onClick={() => setStage("idle")}
            className="text-sm text-[var(--muted)] underline underline-offset-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setStage("confirm")}
          disabled={stage === "sending"}
          className="rounded-lg border border-[var(--sea)] px-4 py-2 text-sm font-medium text-[var(--sea)] transition hover:bg-[var(--sea-100)] disabled:opacity-60"
        >
          {stage === "sending" ? "Sending…" : "Send this reply"}
        </button>
      )}

      {stage === "error" && (
        <p className="mt-3 rounded-lg bg-[#fbe9e9] p-3 text-sm text-[#9b3232]">{error}</p>
      )}

      <p className="mt-2 text-xs text-[var(--muted)]">
        This goes to the guest for real. The reply is rebuilt from the email as it sends, so it
        matches the preview above.
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- tester --- */

function EmailTester({ accessKey }: { accessKey: string }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [data, setData] = useState<PreviewResult | null>(null);
  const [error, setError] = useState("");

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/inquiries/preview", {
        method: "POST",
        headers: { "x-inquiry-secret": accessKey, "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      if (!res.ok) {
        setError(res.status === 401 ? "That access key is not right." : `Test failed (${res.status}).`);
        setState("error");
        return;
      }
      setData((await res.json()) as PreviewResult);
      setState("done");
    } catch {
      setError("Could not reach the site.");
      setState("error");
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-2xl text-[var(--sea)]">Try an email</h2>
      <p className="mt-1.5 text-sm text-[var(--muted)]">
        Paste any inquiry — even an old one you already answered — and see how the robot reads it.
        This never touches your mailbox.
      </p>

      <form onSubmit={run} className="mt-5 space-y-3">
        <input
          id="test-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject line (optional)"
          className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--sea)]"
        />
        <textarea
          id="test-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={9}
          placeholder="Paste the whole email here…"
          className="w-full rounded-xl border border-[var(--border)] px-4 py-3 font-mono text-sm outline-none focus:border-[var(--sea)]"
        />
        <button
          type="submit"
          disabled={state === "loading" || !body.trim()}
          className="rounded-xl bg-[var(--sea)] px-5 py-3 font-medium text-white transition hover:bg-[var(--sea-700)] disabled:opacity-60"
        >
          {state === "loading" ? "Reading…" : "Read this email"}
        </button>
      </form>

      {state === "error" && <Problem>{error}</Problem>}

      {state === "done" && data && (
        <div className="mt-6 rounded-xl border border-[var(--border)] p-4">
          <p className="font-medium text-[var(--foreground)]">
            {data.wouldSend ? "It understood this one." : "It would leave this one for you."}
          </p>
          <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            <Row label="Home" value={data.parsed.slug ?? "— not recognized —"} />
            <Row label="Guest" value={data.parsed.guestEmail ?? "— not found —"} />
            <Row label="Arriving" value={data.parsed.arrival ?? "— not found —"} />
            <Row label="Leaving" value={data.parsed.departure ?? "— not found —"} />
          </dl>
          {data.reason && (
            <p className="mt-3 rounded-lg bg-[#fdf1e0] p-3 text-sm text-[var(--sand-600)]">{data.reason}</p>
          )}
          <ReplyPreview html={data.html} />
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------- tokens --- */

// Each property's booking token is what turns "Book these dates" into a real
// OwnerRez booking form. They are not in the quote, so they are read from the
// property list once and written into the code.
function PropertyTokens({ accessKey }: { accessKey: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [rows, setRows] = useState<{ field: string; value: string }[]>([]);
  const [error, setError] = useState("");

  async function run() {
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/inquiries/properties", { headers: { "x-inquiry-secret": accessKey } });
      const data = (await res.json().catch(() => ({}))) as { rows?: typeof rows; error?: string };
      if (!res.ok) {
        setError(data.error ?? `Could not read the properties (${res.status}).`);
        setState("error");
        return;
      }
      setRows(data.rows ?? []);
      setState("done");
    } catch {
      setError("Could not reach the site.");
      setState("error");
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-2xl text-[var(--sea)]">Booking links</h2>
      <p className="mt-1.5 text-sm text-[var(--muted)]">
        Each home has an OwnerRez booking token — the <code>orp…</code> part of a public booking
        link. Once those are known, &ldquo;Book these dates&rdquo; goes straight to the booking form
        with the stay filled in, instead of the website page. This only reads; it changes nothing.
      </p>

      <button
        onClick={run}
        disabled={state === "loading"}
        className="mt-5 rounded-xl bg-[var(--sea)] px-5 py-3 font-medium text-white transition hover:bg-[var(--sea-700)] disabled:opacity-60"
      >
        {state === "loading" ? "Reading…" : "Show my properties"}
      </button>

      {state === "error" && <Problem>{error}</Problem>}

      {state === "done" && (
        <>
          <pre className="mt-5 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--sea-100)]/40 p-3 font-mono text-xs text-[var(--foreground)]">
            {rows.length ? rows.map((r) => `${r.field}: ${r.value}`).join("\n") : "OwnerRez returned no properties."}
          </pre>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Copy this over and the tokens can be wired in for every home at once.
          </p>
        </>
      )}
    </section>
  );
}

/* ----------------------------------------------------------------- bits --- */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="min-w-20 text-[var(--muted)]">{label}</dt>
      <dd className="text-[var(--foreground)]">{value}</dd>
    </div>
  );
}

function Problem({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 rounded-xl bg-[#fbe9e9] p-4 text-sm text-[#9b3232]">{children}</p>;
}

// The reply is rendered in a sandboxed frame: it is our own generated HTML, but
// an email body has no business running script in the admin page.
//
// allow-same-origin is needed because Safari renders a srcdoc frame blank
// without it. It does not weaken anything that matters here: allow-scripts is
// still absent, so nothing in the document can execute, and a frame that
// cannot run script cannot use an origin for anything.
function ReplyPreview({ html }: { html: string }) {
  return (
    <iframe
      title="Reply preview"
      sandbox="allow-same-origin"
      srcDoc={html}
      className="mt-3 h-80 w-full rounded-lg border border-[var(--border)] bg-white"
    />
  );
}
