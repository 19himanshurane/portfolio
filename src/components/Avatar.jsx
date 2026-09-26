import { useState } from 'react';
import { motion } from 'framer-motion';
import { asset } from '../utils/asset.js';
import './Avatar.css';

export default function Avatar({ size = 'lg' }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className={`avatar avatar--${size}`}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      {!loaded && <div className="avatar__skeleton" aria-hidden="true" />}
      <img
        src={asset('headshot.jpg')}
        alt="Himanshu Rane"
        width="280"
        height="350"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
        className={loaded ? 'is-loaded' : ''}
      />
    </motion.div>
  );
}
