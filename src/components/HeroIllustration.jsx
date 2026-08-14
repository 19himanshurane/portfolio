import { motion } from 'framer-motion';
import './HeroIllustration.css';

export default function HeroIllustration() {
  return (
    <motion.div
      className="hero-illustration"
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="160" cy="290" rx="110" ry="14" fill="#1c1c1c" opacity="0.06" />

        <rect x="70" y="190" width="150" height="90" rx="14" fill="#eae7e1" stroke="#1c1c1c" strokeWidth="3" />
        <rect x="85" y="205" width="120" height="8" rx="4" fill="#98ab86" opacity="0.6" />
        <rect x="85" y="222" width="90" height="8" rx="4" fill="#8ba3c2" opacity="0.5" />

        <path d="M60 260 L120 232 L120 260 Z" fill="#1c1c1c" opacity="0.85" />
        <rect x="35" y="255" width="30" height="20" rx="4" fill="#f7f5f2" stroke="#1c1c1c" strokeWidth="2" />
        <path d="M45 255 Q45 245 55 245" stroke="#1c1c1c" strokeWidth="2" fill="none" />
        <path d="M48 240 Q48 236 52 236" stroke="#c19a7a" strokeWidth="2" fill="none" opacity="0.6" />

        <motion.g
          animate={{ rotate: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '236px 178px' }}
        >
          <path d="M228 200 Q220 175 236 160" stroke="#1c1c1c" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="238" cy="156" r="10" fill="#c19a7a" />
        </motion.g>

        <path d="M120 200 Q120 130 165 122 Q210 130 210 200 Z" fill="#98ab86" />

        <circle cx="163" cy="98" r="46" fill="#c19a7a" />

        <path
          d="M118 92 Q112 50 163 46 Q214 50 210 92 Q205 78 190 74 Q182 62 163 62 Q144 62 136 74 Q121 78 118 92 Z"
          fill="#1c1c1c"
        />
        <circle cx="145" cy="102" r="5" fill="#1c1c1c" />
        <circle cx="181" cy="102" r="5" fill="#1c1c1c" />
        <path d="M148 122 Q163 132 178 122" stroke="#1c1c1c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M130 108 Q135 100 143 100" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M196 108 Q191 100 183 100" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />

        <ellipse cx="95" cy="60" rx="8" ry="18" fill="#8ba3c2" opacity="0.35" transform="rotate(-20 95 60)" />
        <ellipse cx="235" cy="70" rx="6" ry="14" fill="#98ab86" opacity="0.35" transform="rotate(15 235 70)" />
      </svg>
    </motion.div>
  );
}
