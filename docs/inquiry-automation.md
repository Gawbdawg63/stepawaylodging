# Beachcombers NW inquiry automation

Every 15 minutes the site reads unanswered [Beachcombers NW](https://www.beachcombersnw.com/)
inquiries out of the Outlook mailbox, checks the requested dates in OwnerRez,
creates a real saved quote, and emails the guest back — automatically.

## What it does with each inquiry

| Situation | What happens |
| --- | --- |
| Dates, home and guest email all read cleanly, home is free | Creates an OwnerRez quote (7-day expiry) and **sends** the priced reply. Marks the email read, category *Quoted by Step Away bot*. |
| Read cleanly, but the home is booked | Prices every other home for those dates and **sends** a reply listing the ones that are free, cheapest first. |
| Anything unclear — no dates, home not recognised, dates backwards, no guest email | **Sends nothing.** Saves a short "could you confirm your dates" draft, flags the email and leaves it unread, category *Needs a human*. |

The third row is the safety net: a wrong home or a wrong week reaching a guest
is much worse than a slow reply, so an inquiry the parser cannot read with
confidence is always handed to a person.

To stop all automatic sending without a deploy, set `INQUIRY_AUTO_SEND=false`
in Vercel. Every reply then becomes a flagged draft instead.

## One-time setup

**1. OwnerRez token** — OwnerRez → Settings → API → Personal Access Tokens.
Set `OWNERREZ_TOKEN` (and `OWNERREZ_USERNAME` if the login is not
`lisa@bellabeachrentals.com`).

**2. Register an app for the mailbox.** On a Microsoft 365 (work or school)
mailbox this is one command, which creates the app, allows public client flows
and adds the three permissions:

```bash
npm run azure:setup
```

A personal `outlook.com` account has no Azure AD tenant for the CLI to talk to,
so register it by hand instead — [portal.azure.com](https://portal.azure.com)
→ App registrations → New registration:

- Supported account types: include personal Microsoft accounts if the mailbox
  is an `outlook.com` address.
- Authentication → Advanced settings → **Allow public client flows: Yes**.
- API permissions → Microsoft Graph → **Delegated**: `Mail.ReadWrite`,
  `Mail.Send`, `offline_access`.

**3. Sign in once** to mint a refresh token:

```bash
npm run outlook:auth -- <application id>
```

If that reports `AADSTS50059`, the registration is single-tenant (the default),
so device-code sign-in cannot resolve it from the generic `common` endpoint.
Pass the Directory (tenant) ID as a second value — both are on the app
registration's overview page:

```bash
npm run outlook:auth -- <application id> <directory (tenant) id>
```

Set `MS_TENANT_ID` in Vercel to that same directory id when you do.

It prints a short code, you sign in as the inquiry mailbox in a browser, and it
prints the `MS_REFRESH_TOKEN` to paste into Vercel. The argument form works the
same in macOS Terminal, Linux and Windows PowerShell.

**4. Job secret** — `openssl rand -hex 32` into `INQUIRY_JOB_SECRET`.

All variables are listed in [`.env.example`](../.env.example). A Microsoft 365
tenant can use app-only auth instead of step 3 (`MS_TENANT_ID`,
`MS_CLIENT_SECRET`, `MS_MAILBOX`, with admin-consented *application*
permissions), but the refresh token works for both account types.

## The dashboard

`https://stepawaylodging.com/admin/inquiries` is the no-terminal way to watch
the robot. Sign in with the `INQUIRY_JOB_SECRET` (held in that browser tab only,
never sent anywhere but this site) and it offers two read-only checks:

- **Check the inbox** — runs the dry run and lists each unanswered inquiry with
  the home, dates and guest it read, plus the reply it would send. Sends
  nothing, drafts nothing, leaves every email unread. It also states plainly
  whether automatic sending is currently on.
- **Try an email** — paste any inquiry, even an old one, and see how it is read.
  Never touches the mailbox.

The page is excluded from search engines via `robots.ts`.

## Checking it without involving a guest

`POST /api/inquiries/preview` takes a pasted email and shows exactly what the
pipeline would make of it. It reads nothing, sends nothing, and creates no
quote:

```bash
curl -X POST https://stepawaylodging.com/api/inquiries/preview \
  -H "x-inquiry-secret: $INQUIRY_JOB_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Beachcombers NW Inquiry - Ocean Peak Ridge",
       "body":"Property: Ocean Peak Ridge\nName: Sarah Mitchell\nEmail: s@example.com\nArrival: 07/04/2026\nDeparture: 07/11/2026\nAdults: 4"}'
```

The response shows every field the parser found, whether it would send, and the
full reply HTML. **Run a real Beachcombers NW email through this first** — the
parser was built against the labels these emails typically use, but the exact
template has never been seen by the code, and this is where to confirm it.

The scheduled job itself also takes `?dryRun=1`, which reads the real mailbox
and reports what it *would* do without sending anything or marking anything:

```bash
curl -H "x-inquiry-secret: $INQUIRY_JOB_SECRET" \
  "https://stepawaylodging.com/api/inquiries/process?dryRun=1"
```

## If replies look wrong

The parser lives in [`lib/inquiry.ts`](../lib/inquiry.ts). Two things are worth
knowing:

- **Field labels** — each field lists the spellings it accepts (`arrival`,
  `check-in`, `checkin`, …). If a real email uses a label that is not there, add
  it to that list.
- **Home names** — `ALIASES` maps what an email might call a home to its slug.
  It already handles "Ocean Peek Ridge", which is how the OwnerRez widget itself
  spells it.

## Moving parts

| File | Role |
| --- | --- |
| `lib/outlook.ts` | Microsoft Graph: read inbox, reply, draft, flag |
| `lib/inquiry.ts` | Parse an inquiry email into dates, home and guest |
| `lib/ownerrez.ts` | Availability, pricing, and `createQuote()` |
| `lib/reply.ts` | The three reply emails |
| `app/api/inquiries/process/route.ts` | The scheduled job |
| `app/api/inquiries/preview/route.ts` | Safe dry-run against pasted text |
| `app/admin/inquiries/page.tsx` | The dashboard |
| `vercel.json` | Every 15 minutes |
| `scripts/azure-app-setup.sh` | One-command app registration (M365 only) |
| `scripts/outlook-auth.mjs` | One-time sign-in for the refresh token |
