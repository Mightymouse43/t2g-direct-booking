import { Calendar } from 'lucide-react';

/**
 * OwnerRez "Multiple Month Calendar" widget — URL-based property matching.
 *
 * OwnerRez reads the page URL path and automatically shows the calendar for
 * the matching property (configured in OwnerRez → Website → Widgets → Widget Options).
 * No per-property IDs needed here — one embed for all properties.
 *
 * WIDGET_ID: data-widgetId from OwnerRez → Website → Widgets → [widget] → Embed Code.
 * Colors: OwnerRez → Website → Widgets → [widget] → CSS tab.
 */
const WIDGET_ID = '8b6d96c4982b4b8f8bcaec86ea561832';

export default function AvailabilityCalendar() {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <Calendar className="h-5 w-5 text-t2g-teal" />
        <h2 className="font-heading text-2xl font-bold text-t2g-navy">Availability &amp; Rates</h2>
      </div>

      <div className="rounded-2xl border border-t2g-mist bg-white p-4 shadow-sm overflow-hidden">
        <div
          className="ownerrez-widget"
          data-widgetId={WIDGET_ID}
          data-widget-type="Multiple Month calendar - Multiple Month Calendar"
        />
      </div>
    </section>
  );
}
