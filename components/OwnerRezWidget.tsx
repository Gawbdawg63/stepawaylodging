"use client";

import Script from "next/script";
import { primary, ownerRezScript, type Property } from "@/lib/content";

/**
 * Embeds an OwnerRez booking/inquiry widget for a property.
 * The widget.js script scans the page for `.ownerrez-widget` divs and mounts
 * the booking popup into them. Bookings & payments are handled by OwnerRez.
 * Defaults to the primary home; pass `widget` to render a different property's.
 */
export default function OwnerRezWidget({
  widget = primary.ownerRez,
}: {
  widget?: Property["ownerRez"];
}) {
  const ownerRez = { ...widget, scriptSrc: ownerRezScript };
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
