import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP context wrapper that safely cleans up animations on unmount.
 * Usage:
 *   const containerRef = useRef(null);
 *   useScrollAnimation((ctx) => {
 *     ctx.add(() => {
 *       gsap.from('.my-el', { opacity: 0, y: 40, ... });
 *     });
 *   }, containerRef);
 *
 * @param {(ctx: gsap.Context) => void} animationFn - receives a gsap context
 * @param {React.RefObject} scopeRef - the container ref (scopes selector queries)
 * @param {Array} deps - re-run deps (default empty — runs once on mount)
 */
export function useScrollAnimation(animationFn, scopeRef, deps = []) {
  const ctxRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef?.current;
    if (!scope) return;

    // Create a GSAP context scoped to the container element
    ctxRef.current = gsap.context(() => {
      animationFn(ctxRef.current);
    }, scope);

    return () => {
      ctxRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
