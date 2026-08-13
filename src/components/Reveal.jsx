import { motion } from 'framer-motion';

const EASE = [0.4, 0, 0.2, 1];

export default function Reveal({
  children,
  as = 'div',
  y = 24,
  delay = 0,
  duration = 0.55,
  className,
  once = true,
  ...rest
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Component>
  );
}
