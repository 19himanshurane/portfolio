import { motion } from 'framer-motion';
import './EvalGateArt.css';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay, ease: 'easeInOut' }, opacity: { duration: 0.2, delay } },
  }),
};

export default function EvalGateArt() {
  return (
    <div className="evalgate-art">
      <motion.svg
        viewBox="0 0 800 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <rect width="800" height="340" rx="28" fill="#14161a" />

        <circle cx="110" cy="170" r="34" fill="#f8f9fa" opacity="0.08" />
        <text x="110" y="166" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#f8f9fa" opacity="0.75">
          prompt
        </text>
        <text x="110" y="182" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#4a54c4">
          {'Δv4'}
        </text>

        <motion.path d="M144 170 H 300" stroke="#f8f9fa" strokeOpacity="0.35" strokeWidth="2" variants={draw} custom={0.1} />

        <motion.path d="M340 130 V 92" stroke="#f8f9fa" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="3 4" variants={draw} custom={0.2} />
        <text x="340" y="82" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f8f9fa" opacity="0.5">
          golden {'×'}50
        </text>

        <rect x="300" y="130" width="110" height="80" rx="20" fill="none" stroke="#4a54c4" strokeWidth="2.5" />
        <text x="355" y="166" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontSize="14" fontWeight="600" fill="#4a54c4">
          eval
        </text>
        <text x="355" y="184" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f8f9fa" opacity="0.6">
          84% {'→'} 100%
        </text>

        <motion.path d="M410 150 H 460 V 60 H 500" stroke="#4a54c4" strokeWidth="2" fill="none" variants={draw} custom={0.5} />
        <motion.path
          d="M410 190 H 460 V 280 H 500"
          stroke="#f8f9fa"
          strokeOpacity="0.3"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 5"
          variants={draw}
          custom={0.6}
        />

        <rect x="500" y="34" width="150" height="52" rx="14" fill="rgba(74,84,196,0.14)" stroke="#4a54c4" strokeWidth="1.5" />
        <text x="575" y="55" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontSize="12" fontWeight="600" fill="#4a54c4">
          merge
        </text>
        <text x="575" y="72" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f8f9fa" opacity="0.65">
          {'Δ'} under 3%
        </text>

        <rect x="500" y="254" width="150" height="52" rx="14" fill="rgba(248,249,250,0.04)" stroke="#f8f9fa" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="575" y="275" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontSize="12" fontWeight="600" fill="#f8f9fa" opacity="0.7">
          blocked
        </text>
        <text x="575" y="292" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f8f9fa" opacity="0.5">
          {'Δ'} past 8%
        </text>

        <motion.path
          d="M660 145 Q 700 170 660 195"
          stroke="#f8f9fa"
          strokeOpacity="0.4"
          strokeWidth="1.8"
          strokeDasharray="4 5"
          fill="none"
          variants={draw}
          custom={1}
        />
        <circle cx="700" cy="170" r="20" fill="none" stroke="#f8f9fa" strokeOpacity="0.5" strokeWidth="1.8" />
        <text x="700" y="174" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f8f9fa" opacity="0.7">
          drift
        </text>
      </motion.svg>
    </div>
  );
}
