import { useLanguage } from '../context/LanguageContext.jsx';
import { projects } from '../data/content.js';
import './Projects.css';

export default function Projects() {
  const { lang, t } = useLanguage();

  return (
    <section className="projects-page">
      <div className="container">
        <span className="eyebrow">{t.projectsPage.eyebrow}</span>
        <h1 className="projects-page__heading">{t.projectsPage.heading}</h1>
        <p className="muted projects-page__sub">{t.projectsPage.sub}</p>

        <div className="projects-list">
          {projects.map((project) => (
            <article key={project.id} id={project.id} className="project-detail">
              <div className={`icon-badge project-detail__icon accent-${project.accent}`}>
                {project.letter}
              </div>

              <div className="project-detail__body">
                <div className="project-detail__meta">
                  <span className="project-detail__category">{project.category[lang]}</span>
                  <span className="muted project-detail__period">{project.period}</span>
                </div>

                <h2>{project.title}</h2>
                <p className="muted project-detail__org">{project.org}</p>
                <p className="project-detail__desc">{project.description[lang]}</p>

                <div className="project-detail__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="project-detail__highlights">
                  <span className="section-label">{t.projectsPage.highlightsLabel}</span>
                  <ul>
                    {project.highlights[lang].map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>

                <span className="project-detail__status">{project.status[lang]}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
