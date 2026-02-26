import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import PropertyCard from '../properties/PropertyCard';
import { PropertyGridSkeleton } from '../ui/LoadingSpinner';
import ErrorState from '../ui/ErrorState';
import SectionLabel from '../ui/SectionLabel';
import Button from '../ui/Button';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProperties() {
  const { properties, loading, error, refetch } = useProperties();
  const sectionRef = useRef(null);

  const featured = properties.slice(0, 3);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !featured.length) return;

    const cards = Array.from(el.querySelectorAll('.featured-card'));
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 50 });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
        });
      },
    });

    return () => {
      st.kill();
      gsap.set(cards, { clearProps: 'all' });
    };
  }, [featured.length]);

  return (
    <section ref={sectionRef} className="section-padding section-y">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <SectionLabel>Our Properties</SectionLabel>
          <h2 className="font-heading text-4xl font-bold text-t2g-navy md:text-5xl">
            Featured <span className="luxury-accent text-t2g-teal">Stays</span>
          </h2>
        </div>
        <Button as="a" href="/properties" variant="secondary" size="sm">
          View All Properties
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {loading && <PropertyGridSkeleton count={3} />}

      {error && (
        <ErrorState
          title="Couldn't load properties"
          message={error}
          onRetry={refetch}
        />
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <div key={p.id} className="featured-card">
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && properties.length > 3 && (
        <div className="mt-10 text-center">
          <Link
            to="/properties"
            className="font-heading text-sm font-semibold text-t2g-teal hover:text-t2g-navy transition-colors"
          >
            + {properties.length - 3} more properties available →
          </Link>
        </div>
      )}
    </section>
  );
}
