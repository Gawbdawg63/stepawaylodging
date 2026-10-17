import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import { getCollection } from "@/lib/collections";

const collection = getCollection("romantic-oregon-coast-getaways")!;

export const metadata: Metadata = {
  title: collection.title,
  description: collection.description,
  alternates: { canonical: `/${collection.slug}` },
  openGraph: { title: collection.title, description: collection.description, url: `/${collection.slug}`, type: "website" },
};

export default function Page() {
  return <CollectionPage collection={collection} />;
}
