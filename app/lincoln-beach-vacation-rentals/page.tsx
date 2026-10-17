import type { Metadata } from "next";
import AreaPage from "@/components/AreaPage";
import { getArea } from "@/lib/areas";

const area = getArea("lincoln-beach-vacation-rentals")!;

export const metadata: Metadata = {
  title: area.title,
  description: area.description,
  alternates: { canonical: `/${area.slug}` },
  openGraph: {
    title: area.title,
    description: area.description,
    url: `/${area.slug}`,
    type: "website",
  },
};

export default function Page() {
  return <AreaPage area={area} />;
}
