import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ImageOff, Images } from 'lucide-react';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=70&auto=format&fit=crop';

function getUrl(photo) {
  if (!photo) return PLACEHOLDER;
  return photo.url ?? photo.large_url ?? photo.medium_url ?? photo.thumbnail_url ?? PLACEHOLDER;
}

/** Lightbox overlay with keyboard navigation */
function Lightbox({ photos, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Main image */}
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getUrl(photos[current])}
          alt={photos[current]?.caption ?? `Photo ${current + 1}`}
          className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
        />

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 font-body text-xs text-white">
          {current + 1} / {photos.length}
        </div>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
        aria-label="Close gallery"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

/**
 * CSS Grid gallery: 1 large hero + up to 4 thumbnails.
 * Clicking any image opens the lightbox.
 *
 * Props:
 *   photos          — array of photo objects
 *   wrapperClassName — classes applied to the outer relative wrapper
 *                      (default: 'overflow-hidden rounded-3xl')
 *   imgHeight       — CSS height value for the grid (default: '480px' / '360px')
 */
export default function PhotoGallery({
  photos = [],
  wrapperClassName = 'overflow-hidden rounded-3xl',
  imgHeight,
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!photos.length) {
    return (
      <div className={`flex h-64 items-center justify-center bg-t2g-mist/50 ${wrapperClassName}`}>
        <ImageOff className="h-8 w-8 text-t2g-slate/40" />
        <span className="ml-3 font-body text-sm text-t2g-slate/50">No photos available</span>
      </div>
    );
  }

  const shown = photos.slice(0, 5);
  const hasGrid = shown.length > 1;
  const height = imgHeight ?? (hasGrid ? '480px' : '360px');

  return (
    <>
      <div className={`relative ${wrapperClassName}`}>
        <div
          className={hasGrid ? 'grid grid-cols-4 grid-rows-2 gap-2' : ''}
          style={{ height }}
        >
          {/* Hero — spans full height on left */}
          <button
            className={`relative overflow-hidden focus:outline-none ${
              hasGrid ? 'col-span-2 row-span-2' : 'h-full w-full'
            }`}
            onClick={() => setLightboxIndex(0)}
            aria-label="Open photo gallery"
          >
            <img
              src={getUrl(shown[0])}
              alt={shown[0]?.caption ?? 'Primary photo'}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>

          {/* Thumbnails */}
          {shown.slice(1).map((photo, i) => (
            <button
              key={photo.id ?? i}
              className="relative overflow-hidden focus:outline-none"
              onClick={() => setLightboxIndex(i + 1)}
              aria-label={`View photo ${i + 2}`}
            >
              <img
                src={getUrl(photo)}
                alt={photo.caption ?? `Photo ${i + 2}`}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {/* dim last thumb if more photos exist (but not if we're showing the button) */}
              {i === 3 && photos.length > 5 && (
                <div className="absolute inset-0 flex items-center justify-center bg-t2g-navy/60">
                  <span className="font-heading text-sm font-semibold text-white">
                    +{photos.length - 5} more
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* "View All Photos" button — always visible */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-t2g-navy/80 px-4 py-2.5 font-heading text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-t2g-navy"
        >
          <Images className="h-4 w-4" />
          View All Photos
        </button>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
