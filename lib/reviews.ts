import "server-only";

// Pulls guest reviews from the OwnerRez reviews widget's server-rendered page
// and parses them into structured data so we can render our own styled cards.
// OwnerRez only exposes the ~10 most recent reviews (across all homes) plus the
// overall average/count on the embeddable page.

const REVIEWS_URL = "https://app.ownerrez.com/widgets/3a66a8e8-7fa1-4aee-bb3d-5fe623ae7018";

export type Review = {
  author: string;
  property: string;
  date: string;
  stars: number;
  title: string;
  body: string;
};

export type ReviewsData = {
  average: number | null;
  count: number | null;
  reviews: Review[];
};

function strip(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const EMPTY: ReviewsData = { average: null, count: null, reviews: [] };

export async function getReviews(): Promise<ReviewsData> {
  try {
    const res = await fetch(REVIEWS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return EMPTY;
    const html = await res.text();

    const aggText = strip(html);
    const agg = aggText.match(/([0-9.]+)\s*stars? based on\s*([0-9]+)\s*reviews/i);
    const average = agg ? parseFloat(agg[1]) : null;
    const count = agg ? parseInt(agg[2], 10) : null;

    const reviews: Review[] = [];
    const items = html.split('class="review-item"').slice(1);
    for (const raw of items) {
      const b = raw.slice(0, 6000);
      const starsRegion = (b.match(/review-item-stars"([\s\S]*?)review-item-by-line/) || [, b.slice(0, 700)])[1];
      const full = (starsRegion.match(/fas fa-star(?!-half)/g) || []).length;
      const half = (starsRegion.match(/fa-star-half/g) || []).length;
      const stars = full + (half ? 0.5 : 0) || 5;

      const title = strip((b.match(/review-item-title"[^>]*>([\s\S]*?)<\/div>/) || [, ""])[1]);
      const by = strip((b.match(/review-item-by-line"[^>]*>([\s\S]*?)<\/div>/) || [, ""])[1]);
      const bm = by.match(/By\s+(.*?)\s*[–-]\s*stayed at\s+(.*?)\s+in\s+(.*)$/i);
      const author = (bm ? bm[1] : by.replace(/^By\s+/i, "")).trim();
      const property = bm ? bm[2].trim() : "";
      const date = bm ? bm[3].trim() : "";
      const body = strip((b.match(/review-item-body"[^>]*>([\s\S]*?)<\/div>/) || [, ""])[1]);

      if (body) reviews.push({ author, property, date, stars, title, body });
    }

    return { average, count, reviews };
  } catch {
    return EMPTY;
  }
}

// Loose match between one of our home names and the property named in a review.
export function reviewMatchesHome(reviewProperty: string, homeName: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const r = norm(reviewProperty);
  const h = norm(homeName);
  return r.length > 0 && h.length > 0 && (r.includes(h) || h.includes(r));
}
