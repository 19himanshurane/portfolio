import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '../lib/lenis.js';

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = getLenis();

    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.1 });
          else el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
        return;
      }
    }

    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
