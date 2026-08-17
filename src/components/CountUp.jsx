import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export default function CountUp({ value, duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = String(value).match(/^(\d+)(.*)$/);
  const numeric = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const [display, setDisplay] = useState(numeric === null ? value : '0');

  useEffect(() => {
    if (!inView || numeric === null) return;
    const controls = animate(0, numeric, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    });
    return () => controls.stop();
  }, [inView, numeric, duration]);

  return (
    <span ref={ref}>
      {display}
      {numeric !== null ? suffix : ''}
    </span>
  );
}
