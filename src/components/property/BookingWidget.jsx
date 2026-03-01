
/**
 * OwnerRez "Booking/Inquiry" widget — URL-based property matching.
 *
 * OwnerRez reads the page URL and automatically shows the booking form for the
 * matching property (configured in OwnerRez → Website → Widgets → Widget Options).
 *
 * WIDGET_ID: data-widgetId from OwnerRez → Website → Widgets → [booking widget] → Embed Code.
 */
const BOOKING_WIDGET_ID = 'cc7d375f54c44dd4b02fc50f40a8b378';

export default function BookingWidget() {
  return (
    <div className="rounded-3xl border border-t2g-mist bg-white shadow-lg lg:sticky lg:top-28 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 bg-t2g-navy">
        <h3 className="font-heading text-xl font-bold text-white">Book This Property</h3>
        <p className="mt-1 font-body text-sm text-white/65">Direct booking · No OTA fees</p>
      </div>

      {/* OwnerRez booking widget */}
      <div className="px-6 py-6">
        <div
          className="ownerrez-widget"
          data-widgetId={BOOKING_WIDGET_ID}
          data-widget-type="Booking widget - Booking/Inquiry"
        />
      </div>
    </div>
  );
}
