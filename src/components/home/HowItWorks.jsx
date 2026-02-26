import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SectionLabel from '../ui/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: '01',
    title: 'Browse & Choose',
    body: 'Explore our curated collection of San Jose furnished rentals. Filter by bedrooms, guests, and location to find your perfect home.',
    // Rotating compass SVG
    svg: (
      <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none">
        <circle cx="40" cy="40" r="36" stroke="#2E8B8E" strokeWidth="2" opacity="0.3" />
        <circle cx="40" cy="40" r="28" stroke="#2E8B8E" strokeWidth="1.5" opacity="0.5" />
        <g className="compass-needle">
          <path d="M40 14 L44 40 L40 46 L36 40Z" fill="#2E8B8E" />
          <path d="M40 66 L44 40 L40 34 L36 40Z" fill="#1F3642" opacity="0.5" />
        </g>
        <circle cx="40" cy="40" r="4" fill="#2E8B8E" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Book Securely',
    body: 'Complete your reservation directly on our site. No OTA markup — just transparent pricing and secure PCI-compliant payment.',
    svg: (
      <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none">
        <rect x="14" y="20" width="52" height="40" rx="6" stroke="#2E8B8E" strokeWidth="2" opacity="0.3" />
        <rect x="14" y="32" width="52" height="2" fill="#2E8B8E" opacity="0.3" />
        <g className="scan-laser">
          <rect x="14" y="40" width="52" height="1.5" fill="#2E8B8E" opacity="0.8" />
        </g>
        <circle cx="26" cy="52" r="4" fill="#2E8B8E" opacity="0.6" />
        <rect x="34" y="50" width="18" height="4" rx="2" fill="#2E8B8E" opacity="0.3" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Arrive & Enjoy',
    body: 'Receive your check-in details, settle into your fully furnished San Jose rental, and enjoy the T2G experience — backed by 24/7 local support.',
    svg: (
      <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none">
        <g className="wave-group">
          <path d="M10 50 Q25 38 40 50 Q55 62 70 50" stroke="#2E8B8E" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M10 42 Q25 30 40 42 Q55 54 70 42" stroke="#2E8B8E" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M10 58 Q25 46 40 58 Q55 70 70 58" stroke="#2E8B8E" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </g>
        <circle cx="40" cy="28" r="10" stroke="#2E8B8E" strokeWidth="2" opacity="0.5" />
        <path d="M36 28 L39 31 L44 25" stroke="#2E8B8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Compass rotation
      gsap.to('.compass-needle', {
        rotation: 360,
        transformOrigin: '50% 50%',
        duration: 8,
        ease: 'none',
        repeat: -1,
      });

      // Scan laser Y oscillation
      gsap.to('.scan-laser', {
        y: 10,
        duration: 1.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Wave pulsing
      gsap.to('.wave-group path', {
        opacity: (i) => [0.9, 0.6, 0.3][i % 3] * 0.4 + 0.1,
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      });

      // Step cards — reliable direct querySelectorAll approach
      const steps = Array.from(sectionRef.current?.querySelectorAll('.how-step') ?? []);
      if (steps.length) {
        gsap.set(steps, { opacity: 0, y: 50 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(steps, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.2,
            });
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="section-padding section-y bg-t2g-cloud">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <SectionLabel>Simple Process</SectionLabel>
          <h2 className="font-heading text-4xl font-bold text-t2g-navy md:text-5xl">
            How It <span className="luxury-accent text-t2g-teal">Works</span>
          </h2>
          <p className="font-body text-t2g-slate/70 max-w-md mx-auto">
            Three steps from browsing to checked in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ number, title, body, svg }) => (
            <div
              key={number}
              className="how-step relative rounded-3xl bg-white p-8 shadow-sm text-center"
            >
              {/* Step number */}
              <span className="absolute top-6 right-6 font-heading text-5xl font-black text-t2g-mist">
                {number}
              </span>

              {/* SVG icon */}
              <div className="mb-6 flex justify-center">{svg}</div>

              <h3 className="font-heading text-xl font-semibold text-t2g-navy mb-3">{title}</h3>
              <p className="font-body text-sm leading-relaxed text-t2g-slate/70">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
