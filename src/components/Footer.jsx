import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { socials } from '../data/content.js';
import { asset } from '../utils/asset.js';
import { GithubIcon, LinkedinIcon, MailIcon, FileDownIcon } from './icons/ContactIcons.jsx';
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
          <ul className="footer__icon-list">
            <li><a href={socials.github} target="_blank" rel="noreferrer"><GithubIcon className="footer__icon" /> GitHub</a></li>
            <li><a href={socials.linkedin} target="_blank" rel="noreferrer"><LinkedinIcon className="footer__icon" /> LinkedIn</a></li>
            <li><a href={`mailto:${socials.email}`}><MailIcon className="footer__icon" /> {socials.email}</a></li>
            <li><a href={asset(socials.resume)} download><FileDownIcon className="footer__icon" /> {t.footer.resume}</a></li>
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
