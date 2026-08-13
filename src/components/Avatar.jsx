import { asset } from '../utils/asset.js';
import './Avatar.css';

export default function Avatar({ size = 'lg' }) {
  return (
    <div className={`avatar avatar--${size}`}>
      <img src={asset('headshot.jpg')} alt="Himanshu Rane" />
    </div>
  );
}
