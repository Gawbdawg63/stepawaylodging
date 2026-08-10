"use client";

import Script from "next/script";
import { ownerRez } from "@/lib/content";

/**
 * Embeds the OwnerRez booking/inquiry widget for Ocean Peak Ridge.
 * The widget.js script scans the page for `.ownerrez-widget` divs and mounts
 * the booking popup into them. Bookings & payments are handled by OwnerRez.
 */
export default function OwnerRezWidget() {
  return (
    <div className="orez-embed">
      {/* Attribute names are lowercase on purpose: the browser lowercases
          data-* attributes anyway, and that lowercase form is what
          OwnerRez's widget.js reads. */}
      <div
        className="ownerrez-widget"
        data-propertyid={ownerRez.propertyId}
        data-widget-type={ownerRez.widgetType}
        data-widgetid={ownerRez.widgetId}
      />
      <Script src={ownerRez.scriptSrc} strategy="afterInteractive" />
    </div>
  );
}
