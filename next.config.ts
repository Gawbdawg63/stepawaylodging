import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 301/308 redirects from old-site URLs (previous OwnerRez/CMS slugs) to their
  // current equivalents, so migrated links keep their SEO value and no visitor
  // lands on a 404. The `-orp5:id` wildcard matches each home's old URL no
  // matter what ID suffix it had.
  async redirects() {
    const home = (oldSlug: string, newSlug: string) => ({
      source: `/${oldSlug}-orp5:id`,
      destination: `/homes/${newSlug}`,
      permanent: true,
    });
    return [
      // Homes (old OwnerRez property URLs -> current home pages)
      home("ocean-peak-ridge", "ocean-peak-ridge"),
      home("americana", "americana"),
      home("americanas-paris-suite", "americanas-paris-suite"),
      home("barefoot-bungalow", "barefoot-bungalow"),
      home("barefoot-carriage-house", "barefoot-carriage-house"),
      home("ebb-and-flow", "ebb-and-flow"),
      home("beach-bungalow-by-the-sea", "beach-bungalow-by-the-sea"),
      // Old misspelled variant that Google indexed (missing a hyphen)
      { source: "/beach-bungalowby-the-sea-orp5:id", destination: "/homes/beach-bungalow-by-the-sea", permanent: true },

      // Standalone old pages
      { source: "/properties", destination: "/homes", permanent: true },
      { source: "/availability", destination: "/homes", permanent: true },
      { source: "/book", destination: "/homes", permanent: true },
      // Numeric-only (\d+) so these old CMS URLs don't swallow real keyword pages
      // like /oregon-coast-rentals-with-hot-tub.
      { source: "/oregon-coast-:id(\\d+)", destination: "/homes", permanent: true },
      { source: "/central-oregon-:id(\\d+)", destination: "/central-oregon", permanent: true },
      { source: "/list-with-step-away-:id(\\d+)", destination: "/owners", permanent: true },
    ];
  },
};

export default nextConfig;
