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

export default function HeroIllustration() {
  return (
    <motion.div
      className="hero-illustration"
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
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

        <rect x="70" y="190" width="150" height="90" rx="14" fill="#e8eaed" stroke="#14161a" strokeWidth="3" />
        <rect x="85" y="205" width="120" height="8" rx="4" fill="#5b7a68" opacity="0.6" />
        <rect x="85" y="222" width="90" height="8" rx="4" fill="#4a6fa5" opacity="0.5" />

        <path d="M60 260 L120 232 L120 260 Z" fill="#14161a" opacity="0.85" />
        <rect x="35" y="255" width="30" height="20" rx="4" fill="#f8f9fa" stroke="#14161a" strokeWidth="2" />
        <motion.path
          d="M45 255 Q45 245 55 245"
          stroke="#14161a"
          strokeWidth="2"
          fill="none"
          variants={draw}
          custom={1.1}
        />
        <motion.path
          d="M48 240 Q48 236 52 236"
          stroke="#a38a6d"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          variants={draw}
          custom={1.2}
        />

        <motion.g
          animate={{ rotate: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          style={{ transformOrigin: '236px 178px' }}
        >
          <motion.path
            d="M228 200 Q220 175 236 160"
            stroke="#14161a"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            variants={draw}
            custom={0.6}
          />
          <motion.circle
            cx="238"
            cy="156"
            r="10"
            fill="#a38a6d"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.g>

        <path d="M120 200 Q120 130 165 122 Q210 130 210 200 Z" fill="#5b7a68" />

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

        <ellipse cx="95" cy="60" rx="8" ry="18" fill="#4a6fa5" opacity="0.35" transform="rotate(-20 95 60)" />
        <ellipse cx="235" cy="70" rx="6" ry="14" fill="#5b7a68" opacity="0.35" transform="rotate(15 235 70)" />
      </motion.svg>
    </motion.div>
  );
}
