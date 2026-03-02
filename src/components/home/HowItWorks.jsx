import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SectionLabel from '../ui/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const PERKS = [
  {
    number: '01',
    title: 'A Perk Only T2G Guests Get',
    body: "Stay with us and you're in. Our Dining Deals program is exclusive to T2G guests — travelers staying anywhere else simply don't have access.",
    // Calendar with checkmark
    svg: (
      <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none">
        <rect x="14" y="22" width="52" height="44" rx="6" stroke="#2E8B8E" strokeWidth="2" opacity="0.35" />
        <rect x="14" y="22" width="52" height="15" rx="6" fill="#2E8B8E" opacity="0.1" />
        <line x1="28" y1="15" x2="28" y2="28" stroke="#2E8B8E" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        <line x1="52" y1="15" x2="52" y2="28" stroke="#2E8B8E" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        <path className="cal-check" d="M27 49 L35 57 L53 40" stroke="#2E8B8E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Get Your Dining Code',
    body: 'Your reservation comes with a personal guest code. Use it to claim up to 2 exclusive vouchers redeemable at our hand-picked local restaurants.',
    // Ticket with % symbol
    svg: (
      <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none">
        <path
          d="M10 30 Q10 24 16 24 L64 24 Q70 24 70 30 L70 34 Q64 34 64 40 Q64 46 70 46 L70 50 Q70 56 64 56 L16 56 Q10 56 10 50 L10 46 Q16 46 16 40 Q16 34 10 34 Z"
          stroke="#2E8B8E" strokeWidth="2" opacity="0.4" fill="none"
        />
        <line x1="26" y1="26" x2="26" y2="54" stroke="#2E8B8E" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.3" />
        <circle className="pct-symbol" cx="37" cy="36" r="4" stroke="#2E8B8E" strokeWidth="1.5" opacity="0.75" />
        <circle className="pct-symbol" cx="49" cy="47" r="4" stroke="#2E8B8E" strokeWidth="1.5" opacity="0.75" />
        <line className="pct-symbol" x1="34" y1="50" x2="52" y2="33" stroke="#2E8B8E" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Dine & Save Up to 25%',
    body: 'Present your voucher at any partner restaurant near your rental. Premium local dining at member-only prices — exclusively available during your stay.',
    // Fork and knife
    svg: (
      <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none">
        <g className="utensils-group">
          <line x1="29" y1="18" x2="29" y2="62" stroke="#2E8B8E" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <line x1="23" y1="18" x2="23" y2="34" stroke="#2E8B8E" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
          <line x1="35" y1="18" x2="35" y2="34" stroke="#2E8B8E" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
          <path d="M23 34 Q29 40 35 34" stroke="#2E8B8E" strokeWidth="1.5" fill="none" opacity="0.5" />
          <line x1="51" y1="18" x2="51" y2="62" stroke="#2E8B8E" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M51 18 C57 20 60 27 57 33 L51 35" stroke="#2E8B8E" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55" />
        </g>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Calendar checkmark subtle pulse
      gsap.to('.cal-check', {
        scale: 1.12,
        transformOrigin: '40px 48px',
        duration: 1.3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Ticket % symbol shimmer
      gsap.to('.pct-symbol', {
        opacity: 0.35,
        duration: 0.9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.15,
      });

      // Fork & knife gentle sway
      gsap.to('.utensils-group', {
        rotation: 6,
        transformOrigin: '40px 40px',
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Step cards scroll reveal
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
    <section id="dining-deals" ref={sectionRef} className="section-padding section-y bg-t2g-cloud">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <SectionLabel>Member Exclusive</SectionLabel>
          <h2 className="font-heading text-4xl font-bold text-t2g-navy md:text-5xl">
            Exclusive Dining <span className="luxury-accent text-t2g-teal">Deals</span>
          </h2>
          <p className="font-body text-t2g-slate/70 max-w-lg mx-auto">
            Save up to 25% at hand-picked local restaurants — a perk reserved for T2G guests only.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PERKS.map(({ number, title, body, svg }) => (
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

        {/* Bottom callout */}
        <p className="text-center mt-10 font-body text-xs text-t2g-slate/50 tracking-wide uppercase">
          Available exclusively during your stay &nbsp;·&nbsp; Each voucher must be redeemed in a single visit — no splitting across days
        </p>
      </div>
    </section>
  );
}
