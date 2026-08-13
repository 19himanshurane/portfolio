import './Avatar.css';

export default function Avatar({ size = 'lg' }) {
  return (
    <div className={`avatar avatar--${size}`} aria-hidden="true">
      <span>HR</span>
    </div>
  );
}
