import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CentralOregon from "@/components/CentralOregon";
import OwnerCTA from "@/components/OwnerCTA";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: `Central Oregon — ${brand.name}`,
  description:
    "Step Away Lodging is expanding into Central Oregon — Bend, Sunriver, Redmond, and Sisters. Homeowners: apply to have us manage your rental.",
  alternates: { canonical: "/central-oregon" },
};

export default function CentralOregonPage() {
  return (
    <div>
      <Header />
      <CentralOregon />
      <OwnerCTA />
      <Footer subtitle="Now expanding into Central Oregon" />
    </div>
  );
}
