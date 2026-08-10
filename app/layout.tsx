import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { brand } from "@/lib/content";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${brand.domain}`),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s`,
  },
  description:
    "A collection of hand-picked vacation homes and suites on the Oregon Coast — each with a hot tub. Browse our homes and book direct.",
  keywords: [
    "Oregon Coast vacation rentals",
    "Lincoln City vacation rentals",
    "beach house rental Oregon",
    "vacation homes with hot tub",
    "Step Away Lodging",
    "book direct vacation rental",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description:
      "Hand-picked vacation homes and suites on the Oregon Coast. Browse our homes and book direct.",
    url: `https://${brand.domain}`,
    siteName: brand.name,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
