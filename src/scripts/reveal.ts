/** Fade sections in as they enter the viewport. No-op with reduced motion. */
export function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal, .draw-arrow');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => observer.observe(el));

  // Content reached via an anchor or find-in-page must never stay hidden.
  window.addEventListener('hashchange', () => items.forEach((el) => el.classList.add('is-visible')));
  document.addEventListener('focusin', (e) => {
    (e.target as HTMLElement).closest?.('.reveal')?.classList.add('is-visible');
  });
  window.addEventListener('beforeprint', () => items.forEach((el) => el.classList.add('is-visible')));
}
