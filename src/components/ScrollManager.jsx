import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '../lib/lenis.js';

// Route transitions (exit/enter animation + lazy chunk load) can together
// take well over a second, especially on first load over a real network.
// Poll by wall-clock deadline rather than a small fixed attempt count, so
// the hash target isn't abandoned before the destination page has mounted.
const HASH_SCROLL_TIMEOUT_MS = 8000;

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = getLenis();

    if (hash) {
      let cancelled = false;
      let rafId;
      const deadline = Date.now() + HASH_SCROLL_TIMEOUT_MS;

      const tryScroll = () => {
        if (cancelled) return;
        const el = document.querySelector(hash);
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.1 });
          else el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        if (Date.now() < deadline) {
          rafId = requestAnimationFrame(tryScroll);
        }
      };

      const startId = setTimeout(tryScroll, 60);
      return () => {
        cancelled = true;
        clearTimeout(startId);
        cancelAnimationFrame(rafId);
      };
    }

    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);

  return null;
}
