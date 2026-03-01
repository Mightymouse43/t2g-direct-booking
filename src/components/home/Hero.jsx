import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Star } from 'lucide-react';

const HERO_IMAGE = '/02.jpg';

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load OwnerRez widget script
    if (!document.querySelector('script[src="https://app.ownerrez.com/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://app.ownerrez.com/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-anim]', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.3,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Modern furnished rental in San Jose, Silicon Valley"
          className="h-full w-full object-cover"
          fetchpriority="high"
        />
        {/* Lighter overlay so image reads clearly */}
        <div className="absolute inset-0 bg-t2g-navy/40" />
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex w-full flex-col items-center px-4 text-center">
        {/* Heading */}
        <div data-hero-anim className="mb-2">
          <span className="font-body text-sm uppercase tracking-[0.2em] text-t2g-sand/90">
            San Jose, CA &mdash; Book Direct &amp; Save 15%
          </span>
        </div>

        <h1
          data-hero-anim
          className="font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
        >
          Modern. Trusted.{' '}
          <span className="luxury-accent text-t2g-sand">Silicon Valley Stays.</span>
        </h1>

        <p
          data-hero-anim
          className="mt-4 max-w-2xl font-body text-base text-white/75 md:text-lg"
        >
          Fully furnished vacation rentals and corporate housing in Downtown San Jose,
          Japantown, and near SJC Airport. Skip the OTA fees and book directly with T2G
          for guaranteed lowest rates.
        </p>

        {/* OwnerRez Availability / Property Search Widget */}
        <div
          data-hero-anim
          className="mt-10 w-full max-w-5xl"
        >
          <div
            className="ownerrez-widget"
            data-widget-type="Availability/Property Search Widget - Availability/Property Search"
            data-widgetId="f16eb17ab61a460baa850e04c59f28d1"
          />
        </div>

        {/* Social proof strip */}
        <div data-hero-anim className="mt-8 flex flex-wrap items-center justify-center gap-6">
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
    </section>
  );
}
