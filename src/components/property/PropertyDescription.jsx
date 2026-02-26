import { useState } from 'react';

const TRUNCATE_LENGTH = 400;

/**
 * Renders the property description text with a "Read more / Read less" toggle.
 */
export default function PropertyDescription({ description }) {
  const [expanded, setExpanded] = useState(false);
  if (!description) return null;

  const isLong = description.length > TRUNCATE_LENGTH;
  const displayed = isLong && !expanded ? description.slice(0, TRUNCATE_LENGTH) + '…' : description;

  return (
    <div>
      <h2 className="mb-4 font-heading text-xl font-bold text-t2g-navy">About this property</h2>
      <p className="font-body text-base leading-relaxed text-t2g-slate/80 whitespace-pre-line">
        {displayed}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 font-heading text-sm font-semibold text-t2g-teal underline underline-offset-2 hover:text-t2g-navy transition-colors"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
}
