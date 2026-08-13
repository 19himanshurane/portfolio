import { useEffect, useRef } from 'react';
import './SpotlightCursor.css';

export default function SpotlightCursor() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;

    const handleMove = (e) => {
      el.style.setProperty('--spot-x', `${e.clientX}px`);
      el.style.setProperty('--spot-y', `${e.clientY}px`);
    };

    el.style.setProperty('--spot-x', `${window.innerWidth / 2}px`);
    el.style.setProperty('--spot-y', `${window.innerHeight / 2}px`);

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <div ref={ref} className="spotlight-cursor-layer" aria-hidden="true" />;
}
