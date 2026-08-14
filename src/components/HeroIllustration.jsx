import { useState } from 'react';
import { motion } from 'framer-motion';
import './HeroIllustration.css';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1, delay, ease: 'easeInOut' }, opacity: { duration: 0.2, delay } },
  }),
};

const ARM_REST = 170;
const ARM_WAVE = [170, 0, 22, -16, 22, -16, 0];

export default function HeroIllustration() {
  const [isWaving, setIsWaving] = useState(false);

  return (
    <motion.div
      className="hero-illustration"
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      onHoverStart={() => setIsWaving(true)}
      onHoverEnd={() => setIsWaving(false)}
    >
      <motion.svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <ellipse cx="160" cy="290" rx="110" ry="14" fill="#14161a" opacity="0.06" />

        <ellipse cx="95" cy="60" rx="8" ry="18" fill="#4a6fa5" opacity="0.3" transform="rotate(-20 95 60)" />
        <ellipse cx="235" cy="70" rx="6" ry="14" fill="#5b7a68" opacity="0.3" transform="rotate(15 235 70)" />

        {/* torso */}
        <path d="M120 200 Q120 130 165 122 Q210 130 210 200 Z" fill="#5b7a68" />

        {/* head */}
        <circle cx="163" cy="98" r="46" fill="#a38a6d" />
        <path
          d="M118 92 Q112 50 163 46 Q214 50 210 92 Q205 78 190 74 Q182 62 163 62 Q144 62 136 74 Q121 78 118 92 Z"
          fill="#14161a"
        />
        <circle cx="145" cy="102" r="5" fill="#14161a" />
        <circle cx="181" cy="102" r="5" fill="#14161a" />
        <motion.path
          d="M148 122 Q163 132 178 122"
          stroke="#14161a"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          variants={draw}
          custom={0.3}
        />
        <motion.path
          d="M130 108 Q135 100 143 100"
          stroke="#14161a"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          variants={draw}
          custom={0.15}
        />
        <motion.path
          d="M196 108 Q191 100 183 100"
          stroke="#14161a"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          variants={draw}
          custom={0.15}
        />

        {/* laptop - keyboard base */}
        <path
          d="M50 275 L230 275 L245 255 L65 255 Z"
          fill="#e8eaed"
          stroke="#14161a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect x="92" y="262" width="96" height="5" rx="2.5" fill="#14161a" opacity="0.15" />

        {/* laptop - screen */}
        <rect x="80" y="165" width="140" height="95" rx="10" fill="#e8eaed" stroke="#14161a" strokeWidth="3" />
        <rect x="90" y="175" width="120" height="75" rx="5" fill="#14161a" opacity="0.05" />
        <motion.rect
          x="98" y="188" width="75" height="7" rx="3.5" fill="#5b7a68"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 0.75, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: '98px 191.5px' }}
        />
        <motion.rect
          x="98" y="203" width="95" height="7" rx="3.5" fill="#4a6fa5"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 0.65, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: '98px 206.5px' }}
        />
        <motion.rect
          x="98" y="218" width="55" height="7" rx="3.5" fill="#a38a6d"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 0.65, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: '98px 221.5px' }}
        />
        <motion.rect
          x="98" y="233" width="80" height="7" rx="3.5" fill="#5b7a68"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 0.5, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: '98px 236.5px' }}
        />

        {/* waving arm - rests near the keyboard, waves on hover. Painted last so it stays in front of the head/laptop when raised. */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: isWaving ? ARM_WAVE : ARM_REST }}
          transition={
            isWaving
              ? { opacity: { duration: 0.3 }, rotate: { duration: 1.2, ease: 'easeInOut' } }
              : { opacity: { duration: 0.3, delay: 0.8 }, rotate: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
          }
          style={{ transformOrigin: '228px 200px' }}
        >
          <path d="M228 200 Q220 175 236 160" stroke="#14161a" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="238" cy="156" r="10" fill="#a38a6d" />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
