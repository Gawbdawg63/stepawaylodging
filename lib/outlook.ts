import "server-only";

// Server-only Microsoft Graph client for the inquiry mailbox.
//
// Auth supports both shapes so this works with a personal Outlook.com account
// and with a Microsoft 365 tenant mailbox:
//
//   Delegated (MS_REFRESH_TOKEN set) — acts as the signed-in user, mailbox /me.
//     Works for outlook.com and M365. Needs Mail.ReadWrite, Mail.Send,
//     offline_access. Get the refresh token once via `npm run outlook:auth`.
//
//   App-only (no refresh token) — client credentials against MS_MAILBOX.
//     M365 tenants only. Needs Mail.ReadWrite + Mail.Send *application*
//     permissions with admin consent.

const GRAPH = "https://graph.microsoft.com/v1.0";
const LOGIN = "https://login.microsoftonline.com";

const TENANT = process.env.MS_TENANT_ID?.trim() || "common";
const CLIENT_ID = process.env.MS_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.MS_CLIENT_SECRET?.trim();
const REFRESH_TOKEN = process.env.MS_REFRESH_TOKEN?.trim();
const MAILBOX = process.env.MS_MAILBOX?.trim();

export function outlookConfigured(): boolean {
  // Delegated auth via device code produces a public-client refresh token, so
  // no secret is involved. App-only always needs one.
  if (REFRESH_TOKEN) return Boolean(CLIENT_ID);
  return Boolean(CLIENT_ID && CLIENT_SECRET && MAILBOX);
}

// Mailbox path segment: delegated acts as /me, app-only must name the mailbox.
function mailbox(): string {
  return REFRESH_TOKEN ? "/me" : `/users/${encodeURIComponent(MAILBOX ?? "")}`;
}

let cached: { token: string; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && Date.now() < cached.expires) return cached.token;
  if (!CLIENT_ID) throw new Error("Outlook not configured: missing MS_CLIENT_ID");

  const form = new URLSearchParams({ client_id: CLIENT_ID });
  if (CLIENT_SECRET) form.set("client_secret", CLIENT_SECRET);

  if (REFRESH_TOKEN) {
    form.set("grant_type", "refresh_token");
    form.set("refresh_token", REFRESH_TOKEN);
    form.set("scope", "https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send offline_access");
  } else {
    if (!CLIENT_SECRET) throw new Error("Outlook not configured: app-only auth needs MS_CLIENT_SECRET");
    if (!MAILBOX) throw new Error("Outlook not configured: app-only auth needs MS_MAILBOX");
    form.set("grant_type", "client_credentials");
    form.set("scope", "https://graph.microsoft.com/.default");
  }

  const res = await fetch(`${LOGIN}/${TENANT}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Graph token request failed (${res.status}): ${await res.text()}`);

  const data = (await res.json()) as { access_token: string; expires_in: number };
  // Renew a minute early so a token never expires mid-run.
  cached = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return data.access_token;
}

async function graph(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await accessToken();
  return fetch(`${GRAPH}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
}

export type Message = {
  id: string;
  subject: string;
  from: string;
  fromName: string;
  receivedDateTime: string;
  body: string; // plain text
  bodyIsHtml: boolean;
};

type GraphMessage = {
  id: string;
  subject?: string;
  receivedDateTime?: string;
  from?: { emailAddress?: { address?: string; name?: string } };
  body?: { content?: string; contentType?: string };
};

// Unread inbox mail from the Beachcombers NW sender domain, newest first.
//
// The sender match happens here rather than in $filter on purpose: Graph does
// not support contains() on message address fields, and startswith() would miss
// the varied From addresses a directory site sends from. Fetching unread mail
// within the lookback window and matching in code is both correct and cheap.
export async function fetchInquiries(senderDomain: string, lookbackDays: number, limit = 25): Promise<Message[]> {
  const since = new Date(Date.now() - lookbackDays * 86400000).toISOString();
  const query = new URLSearchParams({
    $filter: `isRead eq false and receivedDateTime ge ${since}`,
    $select: "id,subject,from,receivedDateTime,body",
    $orderby: "receivedDateTime desc",
    $top: String(Math.min(limit * 4, 100)),
  });

  const res = await graph(`${mailbox()}/mailFolders/inbox/messages?${query}`);
  if (!res.ok) throw new Error(`Graph list messages failed (${res.status}): ${await res.text()}`);

  const { value = [] } = (await res.json()) as { value?: GraphMessage[] };
  const domain = senderDomain.toLowerCase();

  return value
    .filter((m) => {
      const addr = (m.from?.emailAddress?.address ?? "").toLowerCase();
      const name = (m.from?.emailAddress?.name ?? "").toLowerCase();
      // Match the sending domain, or a display name the directory sets when it
      // forwards on behalf of a guest from some other address.
      return addr.endsWith(`@${domain}`) || addr.endsWith(`.${domain}`) || name.includes("beachcomber");
    })
    .slice(0, limit)
    .map((m) => {
      const isHtml = (m.body?.contentType ?? "").toLowerCase() === "html";
      const raw = m.body?.content ?? "";
      return {
        id: m.id,
        subject: m.subject ?? "",
        from: m.from?.emailAddress?.address ?? "",
        fromName: m.from?.emailAddress?.name ?? "",
        receivedDateTime: m.receivedDateTime ?? "",
        body: isHtml ? htmlToText(raw) : raw,
        bodyIsHtml: isHtml,
      };
    });
}

// Graph's createReply builds the draft with the quoted original and the right
// recipients/threading; we then replace its body with our own copy.
async function createReplyDraft(messageId: string, html: string, to?: string): Promise<string> {
  const created = await graph(`${mailbox()}/messages/${messageId}/createReply`, { method: "POST", body: "{}" });
  if (!created.ok) throw new Error(`Graph createReply failed (${created.status}): ${await created.text()}`);
  const draft = (await created.json()) as { id: string };

  const patch: Record<string, unknown> = { body: { contentType: "HTML", content: html } };
  // The directory forwards on the guest's behalf, so the reply-to address in
  // the inquiry body is the one that actually reaches the guest.
  if (to) patch.toRecipients = [{ emailAddress: { address: to } }];

  const updated = await graph(`${mailbox()}/messages/${draft.id}`, { method: "PATCH", body: JSON.stringify(patch) });
  if (!updated.ok) throw new Error(`Graph patch draft failed (${updated.status}): ${await updated.text()}`);
  return draft.id;
}

export async function sendReply(messageId: string, html: string, to?: string): Promise<void> {
  const draftId = await createReplyDraft(messageId, html, to);
  const sent = await graph(`${mailbox()}/messages/${draftId}/send`, { method: "POST" });
  if (!sent.ok) throw new Error(`Graph send failed (${sent.status}): ${await sent.text()}`);
}

export async function saveDraftReply(messageId: string, html: string, to?: string): Promise<string> {
  return createReplyDraft(messageId, html, to);
}

// Marks the inquiry handled. The category is what makes a run idempotent-ish
// and gives a visible audit trail in Outlook.
export async function markHandled(messageId: string, category: string): Promise<void> {
  await graph(`${mailbox()}/messages/${messageId}`, {
    method: "PATCH",
    body: JSON.stringify({ isRead: true, categories: [category] }),
  });
}

// Leaves an unparseable inquiry unread so it still looks like it needs a human.
export async function flagForReview(messageId: string, category: string): Promise<void> {
  await graph(`${mailbox()}/messages/${messageId}`, {
    method: "PATCH",
    body: JSON.stringify({ categories: [category], flag: { flagStatus: "flagged" } }),
  });
}

export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h[1-6]|li)>/gi, "\n")
    .replace(/<\/t[dh]>/gi, "\t")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}
