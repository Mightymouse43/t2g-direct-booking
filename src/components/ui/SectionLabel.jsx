/**
 * Small uppercase label used above section headings.
 * e.g. <SectionLabel>Our Properties</SectionLabel>
 */
export default function SectionLabel({ children, light = false, className = '' }) {
  return (
    <p
      className={`inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.2em]
        ${light ? 'text-t2g-mist/70' : 'text-t2g-teal'}
        ${className}`}
    >
      <span className={`h-px w-6 ${light ? 'bg-t2g-mist/50' : 'bg-t2g-teal'}`} />
      {children}
    </p>
  );
}
