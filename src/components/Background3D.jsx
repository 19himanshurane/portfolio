import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';
import './Background3D.css';

// Fixed, ambient 3D depth field behind every route. Layers sit at different
// translateZ depths inside a shared perspective; a slow spring follows the
// pointer and page scroll so the whole scene reads as one physical space
// rather than a flat decoration. Colour comes entirely from existing theme
// tokens, so it re-themes for free with the rest of the site.
export default function Background3D() {
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Soft, heavy spring: the background should drift, not react like a card.
  const springX = useSpring(mx, { stiffness: 40, damping: 20, mass: 1 });
  const springY = useSpring(my, { stiffness: 40, damping: 20, mass: 1 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);

  // Scroll nudges the whole scene along Z/Y rather than rotating it, so it
  // reads as the camera drifting through a fixed space, not a spinning card.
  const { scrollYProgress } = useScroll();
  const scrollSpring = useSpring(scrollYProgress, { stiffness: 60, damping: 24, restDelta: 0.001 });
  const scrollY = useTransform(scrollSpring, [0, 1], [0, -70]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduceMotion, mx, my]);

  return (
    <div className="bg3d" aria-hidden="true">
      <motion.div
        className="bg3d__scene"
        style={reduceMotion ? undefined : { rotateX, rotateY, y: scrollY }}
      >
        <div className="bg3d__layer bg3d__layer--far">
          <div className="bg3d__grid bg3d__grid--far" />
        </div>
        <div className="bg3d__layer bg3d__layer--mid">
          <div className="bg3d__orb bg3d__orb--accent" />
          <div className="bg3d__orb bg3d__orb--neutral" />
        </div>
        <div className="bg3d__layer bg3d__layer--near">
          <div className="bg3d__grid bg3d__grid--near" />
        </div>
      </motion.div>
    </div>
  );
}
