#!/usr/bin/env node
// One-time setup: get a Microsoft Graph refresh token for the inquiry mailbox.
//
//   npm run outlook:auth -- <application id> [directory (tenant) id]
//
// (MS_CLIENT_ID in the environment works too, but the argument form is the same
// on macOS, Linux and Windows PowerShell, so prefer it.)
//
// Uses the device-code flow, so there is no redirect URL to configure and no
// client secret to keep: it prints a short code, you sign in to Outlook in a
// browser, and it prints the refresh token to paste into MS_REFRESH_TOKEN.
//
// In the Azure portal (portal.azure.com -> App registrations -> New):
//   * Supported account types: personal Microsoft accounts are fine, pick the
//     option that includes them if the mailbox is an outlook.com address.
//   * Authentication -> Advanced settings -> "Allow public client flows": Yes.
//   * API permissions -> Microsoft Graph -> Delegated:
//     Mail.ReadWrite, Mail.Send, offline_access.

// Accept the id as an argument first: `VAR=value cmd` is not valid syntax in
// PowerShell or cmd.exe, so an argument is the one form that works everywhere.
// Global fetch landed in Node 18. On an older Node this script fails with a
// bare "fetch is not defined", which says nothing about the real problem.
const NODE_MAJOR = Number(process.versions.node.split(".")[0]);
if (NODE_MAJOR < 18) {
  console.error(`\nThis needs Node 18 or newer — you have ${process.versions.node}.\n`);
  console.error("Install the current version from https://nodejs.org, close this");
  console.error("terminal, open a new one, and try again.\n");
  process.exit(1);
}

const CLIENT_ID = (process.argv[2] || process.env.MS_CLIENT_ID || "").trim();
// A single-tenant app registration cannot be resolved from the generic
// "common" endpoint during device-code sign-in, because that first request
// carries no user to imply a tenant. Passing the directory id fixes it.
const TENANT = (process.argv[3] || process.env.MS_TENANT_ID || "common").trim();
const SCOPE = "https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send offline_access";
const LOGIN = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0`;

if (!CLIENT_ID) {
  console.error("Pass your application id:  npm run outlook:auth -- <application id>");
  console.error("(It is the 'Application (client) ID' from the app registration.)");
  process.exit(1);
}

const start = await fetch(`${LOGIN}/devicecode`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: CLIENT_ID, scope: SCOPE }),
});
if (!start.ok) {
  const body = await start.text();
  // AADSTS50059/700016 is what a mistyped or unregistered application id looks
  // like, and the raw message ("no tenant-identifying information") gives no
  // hint of that — so say what actually needs fixing.
  if (/50059|700016|unauthorized_client/.test(body)) {
    console.error(`\nMicrosoft would not accept that application id:\n\n  ${CLIENT_ID}\n`);
    if (TENANT === "common") {
      console.error("Most likely the app is registered for one organisation only, which");
      console.error("is the default. Run it again with your Directory (tenant) ID as a");
      console.error("second value — it is on the same app registration overview page:\n");
      console.error(`  npm run outlook:auth -- ${CLIENT_ID} <directory (tenant) id>\n`);
      console.error("Otherwise, check you copied the \"Application (client) ID\" and not");
      console.error("the object id. A brand new registration can also take a minute.\n");
    } else {
      console.error(`It was not found in the directory you gave:\n\n  ${TENANT}\n`);
      console.error("Check both values on the app registration overview page — the");
      console.error("\"Application (client) ID\" and the \"Directory (tenant) ID\".\n");
    }
  } else {
    console.error(`\nCould not start device login (${start.status}):\n${body}\n`);
  }
  process.exit(1);
}
const device = await start.json();

console.log(`\n  1. Open ${device.verification_uri}`);
console.log(`  2. Enter the code:  ${device.user_code}`);
console.log(`  3. Sign in as the mailbox that receives the Beachcombers NW inquiries.\n`);
console.log("Waiting for you to finish signing in...");

const deadline = Date.now() + device.expires_in * 1000;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

while (Date.now() < deadline) {
  await wait((device.interval || 5) * 1000);

  const res = await fetch(`${LOGIN}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      client_id: CLIENT_ID,
      device_code: device.device_code,
    }),
  });
  const data = await res.json();

  if (res.ok && data.refresh_token) {
    console.log("\nDone. Add these to Vercel (Project -> Settings -> Environment Variables):\n");
    console.log(`MS_CLIENT_ID=${CLIENT_ID}`);
    if (TENANT !== "common") console.log(`MS_TENANT_ID=${TENANT}`);
    console.log(`MS_REFRESH_TOKEN=${data.refresh_token}\n`);
    process.exit(0);
  }
  // authorization_pending simply means the browser step is not finished yet.
  if (data.error && data.error !== "authorization_pending" && data.error !== "slow_down") {
    console.error(`\nSign-in failed: ${data.error} — ${data.error_description ?? ""}`);
    process.exit(1);
  }
  if (data.error === "slow_down") device.interval = (device.interval || 5) + 5;
}

console.error("\nTimed out waiting for sign-in. Run it again.");
process.exit(1);
