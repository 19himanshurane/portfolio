import { useState } from 'react';
import { motion } from 'framer-motion';
import { asset } from '../utils/asset.js';
import './Avatar.css';

export default function Avatar({ size = 'lg' }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className={`avatar avatar--${size}`}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {!loaded && <div className="avatar__skeleton" aria-hidden="true" />}
      <img
        src={asset('headshot.jpg')}
        alt="Himanshu Rane"
        onLoad={() => setLoaded(true)}
        className={loaded ? 'is-loaded' : ''}
      />
    </motion.div>
  );
}
