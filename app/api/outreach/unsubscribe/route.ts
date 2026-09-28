import { loadLeads, saveLeads, unsubToken } from "@/lib/outreach";

export const runtime = "nodejs";

// One-click unsubscribe (linked in every email). Verifies the HMAC token, marks
// the lead unsubscribed so the robot never emails them again, and shows a page.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const email = (params.get("e") || "").toLowerCase();
  const token = params.get("t") || "";
  const page = (msg: string) =>
    new Response(
      `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
        `<div style="font-family:Arial,sans-serif;max-width:520px;margin:12vh auto;padding:0 24px;text-align:center;color:#14494a">` +
        `<h1 style="font-weight:600">Step Away Lodging</h1><p style="font-size:17px;color:#333">${msg}</p></div>`,
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );

  if (!email || !token || token !== unsubToken(email)) {
    return page("That unsubscribe link doesn't look valid. If you'd like to be removed, just reply to any of our emails and we'll take care of it.");
  }

  const leads = await loadLeads();
  const lead = leads.find((l) => l.email.toLowerCase() === email);
  if (lead && lead.status !== "unsubscribed") {
    lead.status = "unsubscribed";
    lead.unsubscribedAt = new Date().toISOString();
    await saveLeads(leads);
  }
  return page("You've been unsubscribed and won't receive any more emails from us. Thanks, and all the best!");
}
