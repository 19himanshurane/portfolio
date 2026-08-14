import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { socials } from '../data/content.js';
import { asset } from '../utils/asset.js';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__name">
            Himanshu Rane
          </Link>
          <p className="muted">{t.footer.tagline}</p>
        </div>

        <div className="footer__col">
          <span className="section-label">{t.footer.navHeading}</span>
          <ul>
            <li><Link to="/">{t.nav.home}</Link></li>
            <li><Link to="/projects">{t.nav.projects}</Link></li>
            <li><Link to="/about">{t.nav.about}</Link></li>
            <li><Link to="/blog">{t.nav.blog}</Link></li>
            <li><Link to="/contact">{t.nav.contact}</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <span className="section-label">{t.footer.elsewhereHeading}</span>
          <ul>
            <li><a href={socials.github} target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href={`mailto:${socials.email}`}>{socials.email}</a></li>
            <li><a href={asset(socials.resume)} download>{t.footer.resume}</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <span className="section-label">{t.footer.statusHeading}</span>
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <p className="muted footer__small">{t.footer.roles}</p>
          <p className="muted footer__small">{t.footer.country}</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <span className="muted footer__small">{t.footer.copyright}</span>
        <span className="muted footer__small">{t.footer.bottomLine}</span>
        <button type="button" className="footer__top" onClick={scrollTop}>
          {t.footer.backToTop}
        </button>
      </div>
    </footer>
  );
}
