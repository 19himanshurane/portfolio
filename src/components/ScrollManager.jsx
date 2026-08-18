import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '../lib/lenis.js';

// Route transitions (exit/enter animation + lazy chunk load) can together
// take well over a second, especially on first load over a real network.
// Poll by wall-clock deadline rather than a small fixed attempt count, so
// the hash target isn't abandoned before the destination page has mounted.
const HASH_SCROLL_TIMEOUT_MS = 8000;

export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const lenis = getLenis();
    const routeChanged = prevPathname.current !== pathname;
    prevPathname.current = pathname;

    if (hash) {
      // Lenis tracks scroll position in its own internal state, independent
      // of the DOM. On a real route change the new page's layout has
      // nothing to do with wherever the user had scrolled to on the
      // previous page, so resync Lenis to the top instantly first.
      // Otherwise its next scrollTo(el) computes the target from stale
      // scroll state and can overshoot the element by however far the user
      // had previously scrolled.
      if (routeChanged) {
        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
      }

      let cancelled = false;
      let rafId;
      const deadline = Date.now() + HASH_SCROLL_TIMEOUT_MS;

      const tryScroll = () => {
        if (cancelled) return;
        const el = document.querySelector(hash);
        if (el) {
          // Instant rather than animated: an eased scroll depends on a
          // sustained run of animation frames right after a route
          // transition, which competes with the page's own mount/exit
          // animations and chunk loading, and can stall out partway.
          // Landing immediately at the right place beats a smooth scroll
          // that might not finish.
          if (lenis) {
            // Lenis caches the page's scrollable height and clamps every
            // scrollTo target to it. Right after a route swap that cache
            // can still reflect the previous page's height, which silently
            // clamps the target back down (often to 0). Force a fresh
            // measurement of the new page before computing the target.
            lenis.resize();
            lenis.scrollTo(el, { offset: -20, immediate: true });
          } else {
            el.scrollIntoView({ behavior: 'auto' });
          }
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
