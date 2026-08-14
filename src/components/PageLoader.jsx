import './PageLoader.css';

export default function PageLoader() {
  return (
    <div className="page-loader" aria-hidden="true">
      <span className="page-loader__dot" />
      <span className="page-loader__dot" />
      <span className="page-loader__dot" />
    </div>
  );
}
