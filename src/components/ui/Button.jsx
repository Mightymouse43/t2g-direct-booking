import { useRef } from 'react';

/**
 * T2G brand button.
 * variant: 'primary' | 'secondary' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  as: Tag = 'button',
  href,
  ...props
}) {
  const ref = useRef(null);

  const base =
    'relative inline-flex items-center justify-center gap-2 font-heading font-semibold overflow-hidden rounded-full transition-all duration-300 ease-t2g select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-t2g-teal focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4 text-lg',
  };

  const variants = {
    primary: 'bg-t2g-navy text-white hover:bg-t2g-teal active:scale-[0.97]',
    secondary: 'bg-transparent border-2 border-t2g-navy text-t2g-navy hover:bg-t2g-navy hover:text-white active:scale-[0.97]',
    ghost: 'bg-transparent text-t2g-navy hover:text-t2g-teal active:scale-[0.97]',
  };

  const handleMouseMove = (e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    btn.style.transform = `scale(1.03) translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  const combinedClass = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (Tag === 'a' || href) {
    return (
      <a
        ref={ref}
        href={href}
        className={combinedClass}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={combinedClass}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}
