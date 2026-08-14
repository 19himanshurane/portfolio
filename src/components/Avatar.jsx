import { useState } from 'react';
import { asset } from '../utils/asset.js';
import './Avatar.css';

export default function Avatar({ size = 'lg' }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`avatar avatar--${size}`}>
      {!loaded && <div className="avatar__skeleton" aria-hidden="true" />}
      <img
        src={asset('headshot.jpg')}
        alt="Himanshu Rane"
        onLoad={() => setLoaded(true)}
        className={loaded ? 'is-loaded' : ''}
      />
    </div>
  );
}
