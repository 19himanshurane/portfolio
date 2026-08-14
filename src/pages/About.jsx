import { useLanguage } from '../context/LanguageContext.jsx';
import { experience, education, certifications, languages, skillGroups } from '../data/content.js';
import Avatar from '../components/Avatar.jsx';
import Reveal from '../components/Reveal.jsx';
import './About.css';

export default function About() {
  const { lang, t } = useLanguage();

  return (
    <section className="about-page">
      <div className="container">
        <div className="about-page__intro">
          <Reveal y={20}>
            <span className="eyebrow">{t.aboutPage.eyebrow}</span>
            <h1>{t.aboutPage.heading}</h1>
            <p className="about-page__body">{t.aboutPage.body1}</p>
            <p className="muted about-page__body">{t.aboutPage.body2}</p>
            <p className="muted about-page__body">{t.aboutPage.body3}</p>
          </Reveal>
          <Reveal y={20} delay={0.15} className="about-page__avatar-wrap">
            <Avatar size="lg" />
          </Reveal>
        </div>

        <Reveal y={20} className="about-page__status card">
          <span className="section-label">{t.aboutPage.statusHeading}</span>
          <p>{t.aboutPage.statusBody}</p>
        </Reveal>

        <div className="about-page__section">
          <span className="section-label">{t.aboutPage.experienceHeading}</span>
          <div className="timeline">
            {experience.map((ex, i) => (
              <Reveal key={ex.org} y={20} delay={i * 0.1} as="div" className="timeline__item">
                <span className="muted timeline__period">{ex.period}</span>
                <div>
                  <h3>{ex.role[lang]}</h3>
                  <p className="muted timeline__org">{ex.org}</p>
                  <p className="timeline__detail">{ex.detail[lang]}</p>
                  <ul className="timeline__highlights">
                    {ex.highlights[lang].map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="about-page__section">
          <span className="section-label">{t.aboutPage.educationHeading}</span>
          <div className="timeline">
            {education.map((ed, i) => (
              <Reveal key={ed.org} y={20} delay={i * 0.1} as="div" className="timeline__item">
                <span className="muted timeline__period">{ed.period}</span>
                <div>
                  <h3>{ed.degree[lang]}</h3>
                  <p className="muted timeline__org">{ed.org}</p>
                  <p className="timeline__detail">{ed.detail[lang]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="about-page__section">
          <span className="section-label">{t.aboutPage.skillsHeading}</span>
          <div className="skills-grid">
            {skillGroups.map((group, i) => (
              <Reveal key={group.heading.en} y={20} delay={i * 0.1} className="card skills-group">
                <h3>{group.heading[lang]}</h3>
                <div className="skills-group__tags">
                  {group.items.map((item) => (
                    <span key={item} className="tag">{item}</span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="about-page__section about-page__split">
          <div>
            <span className="section-label">{t.aboutPage.certificationsHeading}</span>
            <ul className="cert-list">
              {certifications.map((c, i) => (
                <Reveal key={c.name} as="li" y={16} delay={i * 0.06}>
                  <span>{c.name}</span>
                  <span className="muted cert-list__meta">{c.issuer} · {c.year}</span>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <span className="section-label">{t.aboutPage.languagesHeading}</span>
            <ul className="lang-list">
              {languages.map((l, i) => (
                <Reveal key={l.name.en} as="li" y={16} delay={i * 0.06}>
                  <div className="lang-list__row">
                    <span>{l.name[lang]}</span>
                    <span className="tag">{l.level}</span>
                  </div>
                  <p className="muted lang-list__note">{l.note[lang]}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
