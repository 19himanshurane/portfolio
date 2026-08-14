import { motion } from 'framer-motion';
import './AccentLine.css';

export default function AccentLine({ delay = 0 }) {
  return (
    <motion.span
      className="accent-line"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      aria-hidden="true"
    />
  );
}
