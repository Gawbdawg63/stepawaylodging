import { NextRequest, NextResponse } from "next/server";
import { getQuote } from "@/lib/ownerrez";

export const dynamic = "force-dynamic";

// Returns the live price for one home + dates (rent, fees, taxes) from OwnerRez.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const slug = sp.get("slug");
  const arrival = sp.get("arrival");
  const departure = sp.get("departure");
  const adults = Number(sp.get("adults") ?? "2");

  if (!slug || !arrival || !departure) {
    return NextResponse.json({ error: "missing slug/arrival/departure" }, { status: 400 });
  }

  const quote = await getQuote(slug, arrival, departure, adults);
  return NextResponse.json(quote);
}
