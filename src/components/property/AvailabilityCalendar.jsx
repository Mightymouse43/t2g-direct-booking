import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAvailability } from '../../hooks/useAvailability';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Build a Set of 'YYYY-MM-DD' strings for all blocked/booked dates.
 * Handles two OwnerRez response shapes:
 *   - Array/items of { from, to } date-range blocks
 *   - Array/items of { date, available: false } per-day records
 */
function buildBlockedSet(data) {
  const blocked = new Set();
  if (!data) return blocked;

  const items = Array.isArray(data) ? data : (data.items ?? []);

  for (const item of items) {
    if (item.from && item.to) {
      // Expand a date-range block into individual days
      const cur = new Date(item.from);
      const end = new Date(item.to);
      cur.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      while (cur < end) {
        blocked.add(cur.toISOString().slice(0, 10));
        cur.setDate(cur.getDate() + 1);
      }
    } else if (item.date && item.available === false) {
      blocked.add(item.date.slice(0, 10));
    }
  }
  return blocked;
}

/* ─── Single month calendar grid ─────────────────────── */
function MonthGrid({ year, month, blocked, today }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Leading empty cells + day numbers
  const cells = [
    ...Array.from({ length: startDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <p className="mb-4 text-center font-heading text-sm font-semibold text-t2g-navy">
        {MONTH_NAMES[month]} {year}
      </p>

      <div className="grid grid-cols-7 gap-y-1">
        {/* Day-of-week headers */}
        {DAYS.map((d) => (
          <div key={d} className="pb-2 text-center font-body text-xs font-medium text-t2g-slate/40">
            {d}
          </div>
        ))}

        {/* Day cells */}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const date = new Date(year, month, day);
          const isPast = date < today;
          const isBooked = blocked.has(iso);

          let cls = 'mx-auto flex h-8 w-8 items-center justify-center rounded-full font-body text-sm';
          if (isPast) {
            cls += ' text-t2g-slate/25';
          } else if (isBooked) {
            cls += ' text-t2g-slate/40 line-through';
          } else {
            cls += ' bg-t2g-teal/10 font-medium text-t2g-navy';
          }

          return (
            <div key={iso}>
              <div className={cls}>{day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Loading skeleton ────────────────────────────────── */
function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 animate-pulse">
      {[0, 1].map((m) => (
        <div key={m} className="space-y-3">
          <div className="mx-auto h-4 w-28 rounded bg-t2g-mist/60" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="mx-auto h-8 w-8 rounded-full bg-t2g-mist/60" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function AvailabilityCalendar({ propertyId }) {
  // Stable "today" — never changes after mount
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Fetch next 12 months of availability upfront so navigation is instant
  const fromStr = useMemo(() => today.toISOString().slice(0, 10), [today]);
  const toStr = useMemo(() => {
    const t = new Date(today);
    t.setFullYear(t.getFullYear() + 1);
    return t.toISOString().slice(0, 10);
  }, [today]);

  const { availability, loading } = useAvailability(propertyId, fromStr, toStr);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const blocked = useMemo(() => buildBlockedSet(availability), [availability]);

  // Second visible month
  const month2 = viewMonth === 11 ? 0 : viewMonth + 1;
  const year2 = viewMonth === 11 ? viewYear + 1 : viewYear;

  const isAtToday = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const handlePrev = () => {
    if (isAtToday) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const handleNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <Calendar className="h-5 w-5 text-t2g-teal" />
        <h2 className="font-heading text-2xl font-bold text-t2g-navy">Availability</h2>
      </div>

      <div className="rounded-2xl border border-t2g-mist bg-white p-6 shadow-sm">
        {/* Navigation bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isAtToday}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-t2g-mist text-t2g-navy transition-colors hover:bg-t2g-mist disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {!isAtToday ? (
            <button
              onClick={handleToday}
              className="font-body text-xs font-semibold text-t2g-teal transition-colors hover:text-t2g-navy"
            >
              Today
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-t2g-mist text-t2g-navy transition-colors hover:bg-t2g-mist"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Calendar grid */}
        {loading ? (
          <CalendarSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <MonthGrid year={viewYear} month={viewMonth} blocked={blocked} today={today} />
            <MonthGrid year={year2} month={month2} blocked={blocked} today={today} />
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 border-t border-t2g-mist pt-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-t2g-teal/10" />
            <span className="font-body text-xs text-t2g-slate/60">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-t2g-slate/40 line-through">15</span>
            <span className="font-body text-xs text-t2g-slate/60">Booked</span>
          </div>
        </div>
      </div>
    </section>
  );
}
