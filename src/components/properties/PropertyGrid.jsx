import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { PropertyGridSkeleton } from '../ui/LoadingSpinner';
import ErrorState from '../ui/ErrorState';

gsap.registerPlugin(ScrollTrigger);

function EmptyState() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-t2g-mist">
        <Home className="h-7 w-7 text-t2g-navy/40" />
      </div>
      <div className="space-y-1">
        <p className="font-heading text-lg font-semibold text-t2g-navy">No properties match</p>
        <p className="font-body text-sm text-t2g-slate/60">Try adjusting your filters</p>
      </div>
    </div>
  );
}

export default function PropertyGrid({ properties, loading, error, onRetry }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !properties.length) return;

    const cards = Array.from(grid.querySelectorAll('.prop-card'));
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 40 });

    const st = ScrollTrigger.create({
      trigger: grid,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
        });
      },
    });

    return () => {
      st.kill();
      gsap.set(cards, { clearProps: 'all' });
    };
  }, [properties]);

  if (loading) return <PropertyGridSkeleton count={6} />;

  if (error) {
    return (
      <ErrorState
        title="Couldn't load properties"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!properties.length) return <EmptyState />;

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {properties.map((p) => (
        <div key={p.id} className="prop-card">
          <PropertyCard property={p} />
        </div>
      ))}
    </div>
  );
}
