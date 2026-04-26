import { useEffect, useRef } from 'react';

/**
 * Adds reveal class when element enters viewport.
 * @param {string} className  - class to add ('reveal' | 'reveal-left' | 'reveal-right')
 * @param {number} delay      - transition delay in seconds
 */
export function useScrollReveal(className = 'reveal', delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add(className);
    if (delay) el.style.transitionDelay = `${delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [className, delay]);

  return ref;
}

/**
 * Stagger reveal for a list of children.
 * Returns a ref to attach to the parent container.
 */
export function useStaggerReveal(childSelector = '.stagger-item', baseDelay = 0.1) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    children.forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${baseDelay * i}s`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => child.classList.add('revealed'));
          observer.unobserve(container);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [childSelector, baseDelay]);

  return ref;
}
