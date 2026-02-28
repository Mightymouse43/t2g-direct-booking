import { useState, useMemo, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAvailability } from '../../hooks/useAvailability';
import { fetchRates } from '../../api/ownerrez';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/* Parse "YYYY-MM-DD..." as local midnight — avoids UTC off-by-one errors */
function parseLocalDate(str) {
  const [y, m, d] = str.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

/* Format a local Date as "YYYY-MM-DD" without UTC conversion */
function toISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Build Set<'YYYY-MM-DD'> of blocked nights from OwnerRez /v2/bookings response.
 * Each booking item has arrival_date (check-in) and departure_date (check-out).
 * Nights blocked = arrival_date up to but NOT including departure_date.
 * Also handles legacy { from, to } block format just in case.
 */
function buildBlockedSet(data) {
  const blocked = new Set();
  if (!data) return blocked;
  const items = Array.isArray(data) ? data : (data.items ?? []);

  for (const item of items) {
    // OwnerRez /v2/bookings format: arrival_date / departure_date
    if (item.arrival_date && item.departure_date) {
      const cur = parseLocalDate(item.arrival_date);
      const end = parseLocalDate(item.departure_date);
      while (cur < end) {
        blocked.add(toISO(cur));
        cur.setDate(cur.getDate() + 1);
      }
      continue;
    }

    // Legacy block-range format: { from, to, type }
    const type = (item.type ?? '').toLowerCase().trim();
    if (type === 'a' || type === 'available' || type === 'open') continue;

    if (item.from && item.to) {
      const cur = parseLocalDate(item.from);
      const end = parseLocalDate(item.to);
      while (cur < end) {
        blocked.add(toISO(cur));
        cur.setDate(cur.getDate() + 1);
      }
    } else if (item.date && item.available === false) {
      blocked.add(item.date.slice(0, 10));
    }
  }
  return blocked;
}

/**
 * Build Map<'YYYY-MM-DD', number> of nightly rates.
 * Tries several possible OwnerRez field names; uses weekend rate on Fri/Sat if provided.
 */
function buildRateMap(data) {
  const map = new Map();
  if (!data) return map;
  const items = Array.isArray(data) ? data : (data.items ?? []);

  for (const item of items) {
    if (!item.from || !item.to) continue;
    const base = item.nightly_rate ?? item.base_nightly_rate ?? item.rate ?? null;
    if (!base) continue;
    const weekend = item.weekend_nightly_rate ?? item.weekend_rate ?? null;

    const cur = parseLocalDate(item.from);
    const end = parseLocalDate(item.to);

    while (cur < end) {
      const iso = toISO(cur);
      if (!map.has(iso)) {
        const dow = cur.getDay();
        map.set(iso, weekend && (dow === 5 || dow === 6) ? weekend : base);
      }
      cur.setDate(cur.getDate() + 1);
    }
  }
  return map;
}

/* ─── Single month grid ─────────────────────────────── */
function MonthGrid({ year, month, blocked, rates, today }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = new Date(year, month, 1).getDay();

  const cells = [
    ...Array.from({ length: startDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <p className="mb-4 text-center font-heading text-sm font-semibold text-t2g-navy">
        {MONTH_NAMES[month]} {year}
      </p>

      <div className="grid grid-cols-7 gap-x-0.5 gap-y-0.5">
        {DAYS.map((d) => (
          <div key={d} className="pb-2 text-center font-body text-xs font-medium text-t2g-slate/40">
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;

          const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const date = new Date(year, month, day);
          const isPast = date < today;
          const isToday = date.getTime() === today.getTime();
          const isBooked = !isPast && blocked.has(iso);
          const rate = !isPast && !isBooked ? rates.get(iso) : null;

          /* Past */
          if (isPast && !isToday) {
            return (
              <div key={iso} className="flex flex-col items-center py-1.5">
                <span className="font-body text-sm leading-none text-t2g-slate/25">{day}</span>
              </div>
            );
          }

          /* Booked */
          if (isBooked) {
            return (
              <div key={iso} className="flex flex-col items-center rounded py-1.5 bg-t2g-navy">
                <span className="font-body text-sm font-semibold leading-none text-white">{day}</span>
              </div>
            );
          }

          /* Available (today or future) */
          return (
            <div
              key={iso}
              className={`flex flex-col items-center rounded py-1.5 ${
                isToday ? 'ring-2 ring-t2g-teal ring-offset-1' : ''
              }`}
            >
              <span className={`font-body text-sm font-semibold leading-none ${isToday ? 'text-t2g-teal' : 'text-t2g-navy'}`}>
                {day}
              </span>
              {rate != null && (
                <span
                  className="mt-0.5 leading-none text-t2g-teal"
                  style={{ fontSize: '9px', fontFamily: 'inherit' }}
                >
                  ${Math.round(rate)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Loading skeleton ───────────────────────────────── */
function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 animate-pulse">
      {[0, 1].map((m) => (
        <div key={m} className="space-y-2">
          <div className="mx-auto h-4 w-28 rounded bg-t2g-mist/60" />
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-9 w-full rounded bg-t2g-mist/40" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main export ────────────────────────────────────── */
export default function AvailabilityCalendar({ propertyId }) {
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Stable date strings — fetch next 12 months upfront so navigation is instant
  const fromStr = useMemo(() => toISO(today), [today]);
  const toStr = useMemo(() => {
    const t = new Date(today);
    t.setFullYear(t.getFullYear() + 1);
    return toISO(t);
  }, [today]);

  const { availability, loading } = useAvailability(propertyId, fromStr, toStr);

  const [ratesData, setRatesData] = useState(null);
  useEffect(() => {
    if (!propertyId) return;
    fetchRates(propertyId, fromStr, toStr)
      .then(setRatesData)
      .catch(() => {}); // rates are optional — calendar still works without them
  }, [propertyId, fromStr, toStr]);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const blocked = useMemo(() => buildBlockedSet(availability), [availability]);
  const rates = useMemo(() => buildRateMap(ratesData), [ratesData]);

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

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <Calendar className="h-5 w-5 text-t2g-teal" />
        <h2 className="font-heading text-2xl font-bold text-t2g-navy">Availability & Rates</h2>
      </div>

      <div className="rounded-2xl border border-t2g-mist bg-white p-6 shadow-sm">
        {/* Navigation */}
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
              onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}
              className="font-body text-xs font-semibold text-t2g-teal transition-colors hover:text-t2g-navy"
            >
              Today
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-t2g-mist text-t2g-navy transition-colors hover:bg-t2g-mist"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Grids */}
        {loading ? (
          <CalendarSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <MonthGrid year={viewYear} month={viewMonth} blocked={blocked} rates={rates} today={today} />
            <MonthGrid year={year2} month={month2} blocked={blocked} rates={rates} today={today} />
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-t2g-mist pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-t2g-navy">
              <span className="font-body text-xs font-semibold text-white">8</span>
            </div>
            <span className="font-body text-xs text-t2g-slate/60">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 flex-col items-center justify-center rounded">
              <span className="font-body text-xs font-semibold text-t2g-navy leading-none">8</span>
              <span className="text-t2g-teal leading-none" style={{ fontSize: '9px' }}>$142</span>
            </div>
            <span className="font-body text-xs text-t2g-slate/60">Available · nightly rate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
