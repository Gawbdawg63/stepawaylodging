#!/usr/bin/env node
// One-time setup: get a Microsoft Graph refresh token for the inquiry mailbox.
//
//   MS_CLIENT_ID=<app id> node scripts/outlook-auth.mjs
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

const CLIENT_ID = process.env.MS_CLIENT_ID?.trim();
const TENANT = process.env.MS_TENANT_ID?.trim() || "common";
const SCOPE = "https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send offline_access";
const LOGIN = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0`;

if (!CLIENT_ID) {
  console.error("Set MS_CLIENT_ID first:  MS_CLIENT_ID=<app id> node scripts/outlook-auth.mjs");
  process.exit(1);
}

const start = await fetch(`${LOGIN}/devicecode`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: CLIENT_ID, scope: SCOPE }),
});
if (!start.ok) {
  console.error(`Could not start device login (${start.status}):`, await start.text());
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
