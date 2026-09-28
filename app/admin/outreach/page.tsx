import type { Metadata } from "next";
import OutreachAdmin from "@/components/OutreachAdmin";

export const metadata: Metadata = {
  title: "Outreach admin",
  robots: { index: false, follow: false },
};

export default function OutreachAdminPage() {
  return <OutreachAdmin />;
}
