import { motion } from 'framer-motion';
import './CostAutopilotArt.css';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay, ease: 'easeInOut' }, opacity: { duration: 0.2, delay } },
  }),
};

export default function CostAutopilotArt() {
  return (
    <div className="autopilot-art">
      <motion.svg
        viewBox="0 0 800 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <rect width="800" height="340" rx="28" fill="#14161a" />

        <circle cx="120" cy="170" r="34" fill="#f8f9fa" opacity="0.08" />
        <text x="120" y="177" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#f8f9fa" opacity="0.75">
          prompt
        </text>

        <motion.path d="M154 170 H 300" stroke="#f8f9fa" strokeOpacity="0.35" strokeWidth="2" variants={draw} custom={0.1} />

        <rect x="300" y="130" width="110" height="80" rx="20" fill="none" stroke="#b8934f" strokeWidth="2.5" />
        <text x="355" y="165" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="13" fontWeight="600" fill="#b8934f">
          classifier
        </text>
        <text x="355" y="184" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f8f9fa" opacity="0.6">
          86% acc.
        </text>

        <motion.path d="M410 150 H 460 V 60 H 500" stroke="#5b7a68" strokeWidth="2" fill="none" variants={draw} custom={0.5} />
        <motion.path d="M410 170 H 500" stroke="#4a6fa5" strokeWidth="2" fill="none" variants={draw} custom={0.6} />
        <motion.path d="M410 190 H 460 V 280 H 500" stroke="#a38a6d" strokeWidth="2" fill="none" variants={draw} custom={0.7} />

        <rect x="500" y="34" width="130" height="52" rx="14" fill="rgba(91, 122, 104,0.14)" stroke="#5b7a68" strokeWidth="1.5" />
        <text x="565" y="55" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="12" fontWeight="600" fill="#5b7a68">Tier 1</text>
        <text x="565" y="72" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f8f9fa" opacity="0.65">Groq · $</text>

        <rect x="500" y="144" width="130" height="52" rx="14" fill="rgba(74, 111, 165,0.14)" stroke="#4a6fa5" strokeWidth="1.5" />
        <text x="565" y="165" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="12" fontWeight="600" fill="#4a6fa5">Tier 2</text>
        <text x="565" y="182" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f8f9fa" opacity="0.65">Groq · $$</text>

        <rect x="500" y="254" width="130" height="52" rx="14" fill="rgba(163, 138, 109,0.14)" stroke="#a38a6d" strokeWidth="1.5" />
        <text x="565" y="275" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="12" fontWeight="600" fill="#a38a6d">Tier 3</text>
        <text x="565" y="292" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#f8f9fa" opacity="0.65">GPT-4o · $$$</text>

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
          verify
        </text>
      </motion.svg>
    </div>
  );
}
