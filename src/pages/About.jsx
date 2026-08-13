import { useLanguage } from '../context/LanguageContext.jsx';
import { education, certifications, languages, skillGroups } from '../data/content.js';
import Avatar from '../components/Avatar.jsx';
import './About.css';

export default function About() {
  const { lang, t } = useLanguage();

  return (
    <section className="about-page">
      <div className="container">
        <div className="about-page__intro">
          <div>
            <span className="eyebrow">{t.aboutPage.eyebrow}</span>
            <h1>{t.aboutPage.heading}</h1>
            <p className="about-page__body">{t.aboutPage.body1}</p>
            <p className="muted about-page__body">{t.aboutPage.body2}</p>
            <p className="muted about-page__body">{t.aboutPage.body3}</p>
          </div>
          <Avatar size="lg" />
        </div>

        <div className="about-page__status card">
          <span className="section-label">{t.aboutPage.statusHeading}</span>
          <p>{t.aboutPage.statusBody}</p>
        </div>

        <div className="about-page__section">
          <span className="section-label">{t.aboutPage.educationHeading}</span>
          <div className="timeline">
            {education.map((ed) => (
              <div key={ed.org} className="timeline__item">
                <span className="muted timeline__period">{ed.period}</span>
                <div>
                  <h3>{ed.degree[lang]}</h3>
                  <p className="muted timeline__org">{ed.org}</p>
                  <p className="timeline__detail">{ed.detail[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-page__section">
          <span className="section-label">{t.aboutPage.skillsHeading}</span>
          <div className="skills-grid">
            {skillGroups.map((group) => (
              <div key={group.heading.en} className="card skills-group">
                <h3>{group.heading[lang]}</h3>
                <div className="skills-group__tags">
                  {group.items.map((item) => (
                    <span key={item} className="tag">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-page__section about-page__split">
          <div>
            <span className="section-label">{t.aboutPage.certificationsHeading}</span>
            <ul className="cert-list">
              {certifications.map((c) => (
                <li key={c.name}>
                  <span>{c.name}</span>
                  <span className="muted cert-list__meta">{c.issuer} · {c.year}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="section-label">{t.aboutPage.languagesHeading}</span>
            <ul className="lang-list">
              {languages.map((l) => (
                <li key={l.name.en}>
                  <div className="lang-list__row">
                    <span>{l.name[lang]}</span>
                    <span className="tag">{l.level}</span>
                  </div>
                  <p className="muted lang-list__note">{l.note[lang]}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
