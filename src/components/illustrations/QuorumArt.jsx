import { motion } from 'framer-motion';
import './QuorumArt.css';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay, ease: 'easeInOut' }, opacity: { duration: 0.2, delay } },
  }),
};

export default function QuorumArt() {
  return (
    <div className="quorum-art">
      <motion.svg
        viewBox="0 0 800 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <rect width="800" height="340" rx="28" fill="#14161a" />

        <circle cx="85" cy="170" r="30" fill="#f8f9fa" opacity="0.08" />
        <text x="85" y="175" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f8f9fa" opacity="0.75">
          output
        </text>

        <motion.path d="M115 170 H160 V72 H225" stroke="#4a54c4" strokeOpacity="0.6" strokeWidth="2" variants={draw} custom={0.1} />
        <motion.path d="M115 170 H225" stroke="#c4634a" strokeOpacity="0.6" strokeWidth="2" variants={draw} custom={0.15} />
        <motion.path d="M115 170 H160 V268 H225" stroke="#3d8f86" strokeOpacity="0.6" strokeWidth="2" variants={draw} custom={0.2} />

        <rect x="225" y="40" width="140" height="64" rx="16" fill="none" stroke="#4a54c4" strokeWidth="2.5" />
        <text x="295" y="66" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontSize="13" fontWeight="600" fill="#4a54c4">
          accuracy
        </text>
        <text x="295" y="84" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f8f9fa" opacity="0.55">
          Groq
        </text>

        <rect x="225" y="138" width="140" height="64" rx="16" fill="none" stroke="#c4634a" strokeWidth="2.5" />
        <text x="295" y="164" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontSize="13" fontWeight="600" fill="#c4634a">
          logic
        </text>
        <text x="295" y="182" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f8f9fa" opacity="0.55">
          Mistral
        </text>

        <rect x="225" y="236" width="140" height="64" rx="16" fill="none" stroke="#3d8f86" strokeWidth="2.5" />
        <text x="295" y="262" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontSize="13" fontWeight="600" fill="#3d8f86">
          completeness
        </text>
        <text x="295" y="280" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f8f9fa" opacity="0.55">
          Groq
        </text>

        <motion.path d="M365 72 H410 V170 H470" stroke="#4a54c4" strokeOpacity="0.4" strokeWidth="1.8" variants={draw} custom={0.5} />
        <motion.path d="M365 170 H470" stroke="#c4634a" strokeOpacity="0.4" strokeWidth="1.8" variants={draw} custom={0.55} />
        <motion.path d="M365 268 H410 V170 H470" stroke="#3d8f86" strokeOpacity="0.4" strokeWidth="1.8" variants={draw} custom={0.6} />

        <motion.path d="M540 138 V96" stroke="#f8f9fa" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="3 4" variants={draw} custom={0.7} />
        <text x="540" y="86" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f8f9fa" opacity="0.5">
          4 {'Δ'} types
        </text>

        <rect x="470" y="138" width="140" height="64" rx="16" fill="rgba(248,249,250,0.05)" stroke="#f8f9fa" strokeOpacity="0.75" strokeWidth="2" />
        <text x="540" y="164" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontSize="13" fontWeight="600" fill="#f8f9fa">
          adjudicate
        </text>
        <text x="540" y="182" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f8f9fa" opacity="0.55">
          reads the {'Δ'}
        </text>

        <motion.path d="M610 170 H650" stroke="#4a54c4" strokeWidth="2" fill="none" variants={draw} custom={0.85} />

        <rect x="650" y="144" width="130" height="52" rx="14" fill="rgba(74,84,196,0.14)" stroke="#4a54c4" strokeWidth="1.5" />
        <text x="715" y="165" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontSize="12" fontWeight="600" fill="#4a54c4">
          verdict
        </text>
        <text x="715" y="182" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f8f9fa" opacity="0.65">
          conf 0.9
        </text>

        <motion.path
          d="M610 148 Q 700 90 745 232"
          stroke="#f8f9fa"
          strokeOpacity="0.35"
          strokeWidth="1.8"
          strokeDasharray="4 5"
          fill="none"
          variants={draw}
          custom={1}
        />
        <circle cx="745" cy="255" r="22" fill="none" stroke="#f8f9fa" strokeOpacity="0.5" strokeWidth="1.8" />
        <text x="745" y="252" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#f8f9fa" opacity="0.7">
          short
        </text>
        <text x="745" y="262" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#f8f9fa" opacity="0.7">
          circuit
        </text>
      </motion.svg>
    </div>
  );
}
