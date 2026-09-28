import { NextResponse } from "next/server";
import { runOutreach } from "@/lib/outreach";

export const runtime = "nodejs";
export const maxDuration = 60;

// Daily job (scheduled in vercel.json). Also runnable manually from the admin
// page with ?password=. Vercel Cron sends Authorization: Bearer <CRON_SECRET>.
function authorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;
  const pw = new URL(request.url).searchParams.get("password");
  if (process.env.OUTREACH_ADMIN_PASSWORD && pw === process.env.OUTREACH_ADMIN_PASSWORD) return true;
  // If no CRON_SECRET is configured, allow Vercel's cron header presence.
  if (!cronSecret && request.headers.get("x-vercel-cron")) return true;
  return false;
}

async function handle(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await runOutreach();
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: Request) {
  return handle(request);
}
export async function POST(request: Request) {
  return handle(request);
}
