import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { projects, socials } from '../data/content.js';
import Avatar from '../components/Avatar.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import './Home.css';

export default function Home() {
  const { lang, t } = useLanguage();

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1>{t.hero.name}</h1>
            <p className="hero__lead">{t.hero.p1}</p>
            <p className="muted hero__sub">{t.hero.p2}</p>

            <div className="hero__cta">
              <Link to="/projects" className="btn btn-primary">{t.hero.ctaPrimary}</Link>
              <Link to="/contact" className="btn btn-secondary">{t.hero.ctaSecondary}</Link>
            </div>

            <div className="hero__links">
              <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>

            <div className="hero__tags">
              {t.hero.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="hero__card">
            <Avatar size="lg" />
            <div className="hero__card-meta">
              <span className="eyebrow">{t.hero.eyebrow}</span>
              <p className="hero__card-location">{t.hero.location}</p>
              <p className="muted hero__card-degree">{t.hero.degree}</p>
            </div>
            <div className="hero__stats">
              {t.hero.stats.map((s) => (
                <div key={s.label} className="hero__stat">
                  <span className="hero__stat-value">{s.value}</span>
                  <span className="muted hero__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-preview">
        <div className="container about-preview__grid">
          <Avatar size="md" />
          <div>
            <span className="section-label">{t.aboutPreview.label}</span>
            <p className="about-preview__intro">{t.aboutPreview.intro}</p>
            <p className="muted">{t.aboutPreview.body}</p>
          </div>
        </div>
      </section>

      <section className="focus">
        <div className="container">
          <span className="section-label">{t.focus.label}</span>
          <h2 className="focus__heading">{t.focus.heading}</h2>
          <div className="grid grid-3 focus__grid">
            {t.focus.items.map((item) => (
              <div key={item.title} className="card focus__item">
                <h3>{item.title}</h3>
                <p className="muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flagship">
        <div className="container">
          <span className="section-label">{t.flagship.label}</span>
          <div className="flagship__card">
            <div className="flagship__body">
              <h2>{t.flagship.title}</h2>
              <p className="muted">{t.flagship.desc}</p>
              <div className="flagship__tags">
                {t.flagship.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <Link to={`/projects#${projects[0].id}`} className="flagship__link">
                {t.flagship.link} →
              </Link>
            </div>
            <div className="flagship__status">{t.flagship.status}</div>
          </div>
        </div>
      </section>

      <section className="work">
        <div className="container">
          <div className="work__header">
            <div>
              <span className="section-label">{t.work.label}</span>
              <h2>{t.work.heading}</h2>
            </div>
            <Link to="/projects" className="work__viewall">{t.work.viewAll} →</Link>
          </div>
          <div className="grid grid-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="container contact-cta__inner">
          <h2>{t.contactCta.heading}</h2>
          <p className="muted">{t.contactCta.sub}</p>
          <Link to="/contact" className="btn btn-primary">{t.contactCta.button}</Link>
        </div>
      </section>
    </>
  );
}
