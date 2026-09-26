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
      <div className="container footer__top-row">
        <div className="footer__brand">
          <Link to="/" className="footer__name" translate="no">
            Himanshu Rane
          </Link>
          <p className="muted footer__tagline">{t.footer.tagline}</p>
          <p className="eyebrow eyebrow--status footer__status">{t.hero.eyebrow}</p>
          <p className="muted footer__small">{t.footer.roles} · {t.footer.country}</p>
        </div>

        <nav className="footer__col" aria-label={t.footer.navHeading}>
          <span className="footer__heading">{t.footer.navHeading}</span>
          <ul>
            <li><Link to="/">{t.nav.home}</Link></li>
            <li><Link to="/projects">{t.nav.projects}</Link></li>
            <li><Link to="/about">{t.nav.about}</Link></li>
            <li><Link to="/contact">{t.nav.contact}</Link></li>
          </ul>
        </nav>

        <div className="footer__col">
          <span className="footer__heading">{t.footer.elsewhereHeading}</span>
          <ul>
            <li><a href={socials.github} target="_blank" rel="noreferrer"><GithubIcon className="footer__icon" /> GitHub</a></li>
            <li><a href={socials.linkedin} target="_blank" rel="noreferrer"><LinkedinIcon className="footer__icon" /> LinkedIn</a></li>
            <li><a href={`mailto:${socials.email}`}><MailIcon className="footer__icon" /> {socials.email}</a></li>
            <li><a href={asset(socials.resume)} download><FileDownIcon className="footer__icon" /> {t.footer.resume}</a></li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <span className="muted footer__small">{t.footer.copyright}</span>
        <span className="muted footer__small footer__line">{t.footer.bottomLine}</span>
        <button type="button" className="footer__top" onClick={scrollTop}>
          {t.footer.backToTop} <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}
