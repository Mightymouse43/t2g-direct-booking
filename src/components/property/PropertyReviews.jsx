import { useState } from 'react';
import { MessageSquare, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useReviews } from '../../hooks/useReviews';

const INITIAL_COUNT = 5;

/* ─── Format ISO date → "January 2025" ─────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/* ─── Initials from listing site ────────────────────────── */
function getInitials(listingSite) {
  return (listingSite ?? 'G').charAt(0).toUpperCase();
}

/* ─── Display name from listing site ───────────────────── */
function getDisplayName(listingSite) {
  return listingSite ? `${listingSite} Guest` : 'Verified Guest';
}

/* ─── Star row ──────────────────────────────────────────── */
function StarRow({ rating, size = 'sm' }) {
  const sz = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${sz} ${n <= rating ? 'fill-t2g-sand stroke-t2g-sand' : 'stroke-t2g-mist fill-none'}`}
        />
      ))}
    </div>
  );
}

/* ─── Individual review card ────────────────────────────── */
function ReviewCard({ review, isFirst }) {
  const name = getDisplayName(review.listing_site);
  const initials = getInitials(review.listing_site);

  return (
    <div className={`${isFirst ? '' : 'border-t border-t2g-mist pt-5'}`}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-t2g-teal/10">
          <span className="font-body text-sm font-semibold text-t2g-teal">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + date row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-body text-sm font-semibold text-t2g-navy">{name}</span>
            <span className="font-body text-xs text-t2g-slate/60">{formatDate(review.date)}</span>
          </div>

          {/* Stars */}
          {review.stars != null && (
            <div className="mt-1">
              <StarRow rating={review.stars} />
            </div>
          )}

          {/* Comment */}
          {review.body && (
            <p className="mt-2 font-body text-sm leading-relaxed text-t2g-slate/80">
              {review.body}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Loading skeleton ──────────────────────────────────── */
function ReviewsSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`${i > 0 ? 'border-t border-t2g-mist pt-5' : ''} flex gap-3`}>
          <div className="h-10 w-10 shrink-0 rounded-full bg-t2g-mist/60" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 rounded bg-t2g-mist/60" />
            <div className="h-3 w-20 rounded bg-t2g-mist/60" />
            <div className="h-3 w-full rounded bg-t2g-mist/60" />
            <div className="h-3 w-4/5 rounded bg-t2g-mist/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────── */
export default function PropertyReviews({ propertyId, reviewMeta }) {
  const { reviews, loading } = useReviews(propertyId);
  const [expanded, setExpanded] = useState(false);

  const average = reviewMeta?.average;
  const count = reviewMeta?.count ?? reviews.length;

  // Don't render the section at all if there's nothing to show
  if (!loading && reviews.length === 0 && !average) return null;

  const visibleReviews = expanded ? reviews : reviews.slice(0, INITIAL_COUNT);
  const hasMore = reviews.length > INITIAL_COUNT;

  return (
    <section>
      {/* Section header */}
      <div className="mb-6 flex items-center gap-3">
        <MessageSquare className="h-5 w-5 text-t2g-teal" />
        <h2 className="font-heading text-2xl font-bold text-t2g-navy">Guest Reviews</h2>
        {count > 0 && (
          <span className="rounded-full bg-t2g-teal/10 px-2.5 py-0.5 font-body text-xs font-semibold text-t2g-teal">
            {count}
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-t2g-mist bg-white p-6 shadow-sm">
        {/* Summary bar */}
        {average != null && (
          <div className="mb-6 flex items-center gap-3 border-b border-t2g-mist pb-6">
            <StarRow rating={Math.round(average)} size="lg" />
            <span className="font-heading text-3xl font-bold text-t2g-navy">
              {Number(average).toFixed(1)}
            </span>
            {count > 0 && (
              <span className="font-body text-sm text-t2g-slate/60">
                · {count} {count === 1 ? 'review' : 'reviews'}
              </span>
            )}
          </div>
        )}

        {/* Reviews list */}
        {loading ? (
          <ReviewsSkeleton />
        ) : reviews.length > 0 ? (
          <div className="space-y-5">
            {visibleReviews.map((review, i) => (
              <ReviewCard key={review.id ?? i} review={review} isFirst={i === 0} />
            ))}
          </div>
        ) : (
          average != null && (
            <p className="font-body text-sm text-t2g-slate/60">No written reviews yet.</p>
          )
        )}

        {/* Expand / collapse */}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-6 flex items-center gap-1.5 border-t border-t2g-mist pt-5 font-body text-sm font-semibold text-t2g-teal transition-colors hover:text-t2g-navy"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show fewer reviews
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show all {reviews.length} reviews
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
