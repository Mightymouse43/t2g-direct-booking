import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink, Calendar } from 'lucide-react';
import { useProperty } from '../hooks/useProperty';
import PropertyHero from '../components/property/PropertyHero';
import PhotoGallery from '../components/property/PhotoGallery';
import PropertyDetails from '../components/property/PropertyDetails';
import AmenitiesGrid from '../components/property/AmenitiesGrid';
import PropertyDescription from '../components/property/PropertyDescription';
import ErrorState from '../components/ui/ErrorState';

/* ─────────────────────────────────────────────────────────
   Skeleton while data loads
───────────────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[55vh] w-full bg-t2g-mist/60" />
      <div className="mx-auto max-w-7xl section-padding py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="h-64 rounded-3xl bg-t2g-mist/60" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-t2g-mist/60" />)}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-t2g-mist/60" />
              <div className="h-4 w-full rounded bg-t2g-mist/60" />
              <div className="h-4 w-5/6 rounded bg-t2g-mist/60" />
            </div>
          </div>
          <div className="h-80 rounded-3xl bg-t2g-mist/60 lg:sticky lg:top-28" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Sticky booking panel (right column)
   Will be replaced by BookingWidget in Phase 7.
───────────────────────────────────────────────────────── */
function BookingPanel({ property }) {
  const price = property?.avg_nightly_rate ?? property?.base_nightly_rate ?? property?.min_rate;
  const orBookingUrl = property?.booking_url ?? null;

  return (
    <div className="rounded-3xl border border-t2g-mist bg-white p-6 shadow-lg lg:sticky lg:top-28">
      {/* Price */}
      <div className="mb-5 border-b border-t2g-mist pb-5">
        {price != null ? (
          <p className="font-heading text-2xl font-bold text-t2g-navy">
            From{' '}
            <span className="text-3xl">${Number(price).toLocaleString()}</span>
            <span className="font-normal text-base text-t2g-slate/60"> / night</span>
          </p>
        ) : (
          <p className="font-body text-t2g-slate/60">Contact for pricing</p>
        )}
        <div className="mt-2 flex items-center gap-1.5 font-body text-sm text-t2g-slate/70">
          <Star className="h-4 w-4 fill-t2g-sand stroke-t2g-sand" />
          <span>Superhost · Direct booking</span>
        </div>
      </div>

      {/* Booking CTA */}
      {orBookingUrl ? (
        <a
          href={orBookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-t2g-teal px-6 py-3.5 font-heading text-sm font-semibold text-white transition hover:bg-t2g-teal/90 shadow-md"
        >
          <Calendar className="h-4 w-4" />
          Check Availability &amp; Book
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>
      ) : (
        <a
          href={`mailto:tenants2guest@gmail.com?subject=Booking enquiry: ${encodeURIComponent(property?.name ?? 'Property')}`}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-t2g-teal px-6 py-3.5 font-heading text-sm font-semibold text-white transition hover:bg-t2g-teal/90 shadow-md"
        >
          <Calendar className="h-4 w-4" />
          Request a Booking
        </a>
      )}

      {/* Trust badges */}
      <div className="mt-5 space-y-2.5 rounded-2xl bg-t2g-mist/40 p-4">
        {[
          'No OTA markups — book direct & save',
          'Instant booking confirmation',
          '24 / 7 local host support',
        ].map((t) => (
          <p key={t} className="flex items-start gap-2 font-body text-xs text-t2g-slate/80">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-t2g-teal/20 text-center text-[10px] leading-4 text-t2g-teal">✓</span>
            {t}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Mobile sticky bottom bar
───────────────────────────────────────────────────────── */
function MobileBookingBar({ property }) {
  const price = property?.avg_nightly_rate ?? property?.base_nightly_rate ?? property?.min_rate;
  const orBookingUrl = property?.booking_url ?? null;
  const href = orBookingUrl
    ? orBookingUrl
    : `mailto:tenants2guest@gmail.com?subject=Booking enquiry: ${encodeURIComponent(property?.name ?? 'Property')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-t2g-mist bg-white px-4 py-3 shadow-2xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
        {price != null && (
          <p className="font-heading text-lg font-bold text-t2g-navy">
            ${Number(price).toLocaleString()}
            <span className="font-normal text-sm text-t2g-slate/60">/night</span>
          </p>
        )}
        <a
          href={href}
          target={orBookingUrl ? '_blank' : undefined}
          rel={orBookingUrl ? 'noopener noreferrer' : undefined}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-t2g-teal px-5 py-3 font-heading text-sm font-semibold text-white shadow-md"
        >
          <Calendar className="h-4 w-4" />
          Book Now
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────── */
export default function PropertyDetailPage() {
  const { id } = useParams();
  const { property, loading, error, refetch } = useProperty(id);

  if (loading) return <DetailSkeleton />;
  if (error) {
    return (
      <div className="pt-32 section-padding section-y">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }
  if (!property) return null;

  const photos = property.photos ?? [];
  const amenities = property.amenities ?? property.amenity_list ?? [];
  const description = property.description ?? property.summary ?? null;

  return (
    <>
      {/* Hero banner */}
      <PropertyHero property={property} />

      <div className="mx-auto max-w-7xl section-padding pb-24 pt-8 lg:pb-12">
        {/* Back link */}
        <Link
          to="/properties"
          className="mb-6 inline-flex items-center gap-1.5 font-body text-sm text-t2g-teal hover:text-t2g-navy transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all properties
        </Link>

        {/* Two-column layout */}
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">

          {/* ── Left column ─────────────────────────────── */}
          <div className="space-y-10">
            {photos.length > 0 && <PhotoGallery photos={photos} />}
            <PropertyDetails property={property} />
            {description && <PropertyDescription description={description} />}
            {amenities.length > 0 && <AmenitiesGrid amenities={amenities} />}
          </div>

          {/* ── Right column (desktop sticky) ───────────── */}
          <div className="hidden lg:block">
            <BookingPanel property={property} />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <MobileBookingBar property={property} />
    </>
  );
}
