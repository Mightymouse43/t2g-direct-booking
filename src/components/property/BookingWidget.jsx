import { useEffect } from 'react';

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
  useEffect(() => {
    // widget.js may already be loaded by AvailabilityCalendar — guard against duplicates
    if (document.querySelector('script[src*="ownerrez.com/widget.js"]')) return;
    const s = document.createElement('script');
    s.src = 'https://app.ownerrez.com/widget.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <div className="rounded-3xl border border-t2g-mist bg-white shadow-lg lg:sticky lg:top-28 overflow-hidden">
      {/* Trust badges */}
      <div className="px-5 py-4 border-b border-t2g-mist bg-t2g-mist/30">
        {[
          'No OTA markups — book direct & save',
          'Instant booking confirmation',
          '24 / 7 local host support',
        ].map((t) => (
          <p key={t} className="flex items-center gap-2 font-body text-xs text-t2g-slate/80 py-1">
            <span className="h-4 w-4 shrink-0 rounded-full bg-t2g-teal/20 text-center text-[10px] leading-4 text-t2g-teal">✓</span>
            {t}
          </p>
        ))}
      </div>

      {/* OwnerRez booking widget — property matched from page URL */}
      <div
        className="ownerrez-widget"
        data-widgetId={BOOKING_WIDGET_ID}
        data-widget-type="Booking widget - Booking/Inquiry"
      />
    </div>
  );
}
