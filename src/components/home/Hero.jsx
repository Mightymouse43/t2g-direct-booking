import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowDown, Star } from 'lucide-react';
import Button from '../ui/Button';
import SectionLabel from '../ui/SectionLabel';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1800&q=80&auto=format&fit=crop';

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-anim]', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.3,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-end overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Modern furnished rental in San Jose, Silicon Valley"
          className="h-full w-full object-cover"
          fetchpriority="high"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-padding w-full pb-20 md:pb-28">
        <div className="max-w-3xl">
          <div data-hero-anim>
            <SectionLabel light>San Jose, CA &mdash; Book Direct &amp; Save 15%</SectionLabel>
          </div>

          <h1
            data-hero-anim
            className="mt-5 font-heading text-5xl font-bold leading-[1.05] text-white md:text-6xl lg:text-7xl"
          >
            Modern. Trusted.{' '}
            <span className="luxury-accent text-t2g-sand">Silicon Valley Stays.</span>
          </h1>

          <p
            data-hero-anim
            className="mt-6 max-w-xl font-body text-lg text-white/80"
          >
            Fully furnished vacation rentals and corporate housing in Downtown
            San Jose, Japantown, and near SJC Airport. Skip the OTA fees and
            book directly with T2G for guaranteed lowest rates.
          </p>

          <div data-hero-anim className="mt-8 flex flex-wrap items-center gap-4">
            <Button as="a" href="/properties" variant="primary" size="lg">
              Browse Properties
            </Button>
            <Button
              as="a"
              href="#how-it-works"
              variant="secondary"
              size="lg"
              className="border-white/40 text-white hover:bg-white hover:text-t2g-navy"
            >
              How It Works
            </Button>
          </div>

          {/* Social proof strip */}
          <div data-hero-anim className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-t2g-mustard text-t2g-mustard" />
                ))}
              </div>
              <span className="font-body text-sm text-white/80">4.8 · 900+ reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="/superhost-emblem.jpg"
                alt="Airbnb Superhost"
                className="h-7 w-auto rounded"
              />
              <span className="font-body text-sm text-white/80">Superhost Certified</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          data-hero-anim
          className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2"
        >
          <span className="font-body text-xs uppercase tracking-widest text-white/50">Scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce text-white/50" />
        </div>
      </div>
    </section>
  );
}
