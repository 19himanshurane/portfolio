import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './TiltCard.css';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function TiltCard({ children, className = '', as = 'div', tiltRange = 6, shine = true, ...rest }) {
  const ref = useRef(null);
  const reduced = prefersReducedMotion();
  const Component = motion[as] || motion.div;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springX = useSpring(mx, { stiffness: 300, damping: 30 });
  const springY = useSpring(my, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [0, 1], [tiltRange, -tiltRange]);
  const rotateY = useTransform(springX, [0, 1], [-tiltRange, tiltRange]);
  const shineX = useTransform(springX, (v) => `${v * 100}%`);
  const shineY = useTransform(springY, (v) => `${v * 100}%`);

  const handleMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: 1000 }}
      className="tilt-perspective"
    >
      <Component
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`tilt-card ${className}`}
        {...rest}
      >
        {shine && (
          <motion.span
            className="tilt-card__shine"
            style={{ '--shine-x': shineX, '--shine-y': shineY }}
            aria-hidden="true"
          />
        )}
        {children}
      </Component>
    </div>
  );
}
