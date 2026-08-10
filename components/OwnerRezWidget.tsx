"use client";

import Script from "next/script";
import { primary, ownerRezScript, type OwnerRezWidgetConfig } from "@/lib/content";

/**
 * Embeds an OwnerRez widget — a per-home booking/inquiry popup, or the
 * portfolio-wide availability/property search. The widget.js script scans the
 * page for `.ownerrez-widget` divs and mounts the widget into them. Bookings &
 * payments are handled by OwnerRez.
 *
 * Attribute names are lowercase on purpose: the browser lowercases data-*
 * attributes anyway, and that lowercase form is what OwnerRez's widget.js reads.
 * `data-propertyid` is omitted for the search widget (no propertyId).
 */
export default function OwnerRezWidget({
  widget = primary.ownerRez,
}: {
  widget?: OwnerRezWidgetConfig;
}) {
  return (
    <div className="orez-embed">
      <div
        className="ownerrez-widget"
        data-propertyid={widget.propertyId}
        data-widget-type={widget.widgetType}
        data-widgetid={widget.widgetId}
      />
      <Script src={ownerRezScript} strategy="afterInteractive" />
    </div>
  );
}
