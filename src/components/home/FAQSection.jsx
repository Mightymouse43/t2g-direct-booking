import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);
import { FAQ_DATA } from '../../constants/faqData';
import SectionLabel from '../ui/SectionLabel';

function FAQItem({ q, a, isOpen, onToggle }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    gsap.to(el, {
      height: isOpen ? 'auto' : 0,
      duration: 0.35,
      ease: 'power2.inOut',
    });
  }, [isOpen]);

  return (
    <div className="border-b border-t2g-mist last:border-0">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-heading text-base font-semibold text-t2g-navy">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-t2g-teal transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div ref={bodyRef} className="overflow-hidden h-0">
        <p className="pb-5 font-body text-sm leading-relaxed text-t2g-slate/80">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const items = Array.from(el.querySelectorAll('.faq-item'));
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y: 20 });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.07,
        });
      },
    });

    return () => {
      st.kill();
      gsap.set(items, { clearProps: 'all' });
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-padding section-y bg-t2g-cloud">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 space-y-3">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-heading text-4xl font-bold text-t2g-navy md:text-5xl">
            Common <span className="luxury-accent text-t2g-teal">Questions</span>
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 md:p-10 shadow-sm">
          {FAQ_DATA.map((item, i) => (
            <div key={i} className="faq-item">
              <FAQItem
                q={item.q}
                a={item.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
