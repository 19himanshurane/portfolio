import { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { projects } from '../data/content.js';
import Reveal from '../components/Reveal.jsx';
import { GithubIcon, ArrowUpRightIcon, FileDownIcon, AwardIcon } from '../components/icons/ContactIcons.jsx';
import { asset } from '../utils/asset.js';
import './Projects.css';

const domainKey = (project) => project.category.en.split('·').pop().trim();
const domainLabel = (project, lang) => project.category[lang].split('·').pop().trim();

export default function Projects() {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const domains = useMemo(() => {
    const seen = new Map();
    projects.forEach((p) => {
      if (!seen.has(domainKey(p))) seen.set(domainKey(p), domainLabel(p, lang));
    });
    return Array.from(seen.entries());
  }, [lang]);

  const visibleProjects = filter === 'all' ? projects : projects.filter((p) => domainKey(p) === filter);

  return (
    <section className="projects-page">
      <div className="container">
        <span className="eyebrow">{t.projectsPage.eyebrow}</span>
        <Reveal as="h1" y={20} className="projects-page__heading">{t.projectsPage.heading}</Reveal>
        <Reveal as="p" y={20} delay={0.08} className="muted projects-page__sub">{t.projectsPage.sub}</Reveal>

        <Reveal as="div" y={16} delay={0.12} className="projects-filter" role="tablist" aria-label="Filter projects">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={`projects-filter__chip ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t.projectsPage.filterAll}
          </button>
          {domains.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={`projects-filter__chip ${filter === key ? 'is-active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </Reveal>

        <div className="projects-list">
          {visibleProjects.map((project, i) => (
            <Reveal
              key={project.id}
              as="article"
              id={project.id}
              y={28}
              delay={i * 0.08}
              className="project-detail"
            >
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

                {project.metric && (
                  <div className="project-detail__metric">
                    <span className="project-detail__metric-dot" aria-hidden="true" />
                    <span className="project-detail__metric-value">{project.metric.value}</span>
                    <span className="project-detail__metric-label">{project.metric.label[lang]}</span>
                  </div>
                )}

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

                <div className="project-detail__footer">
                  <span className="project-detail__status">{project.status[lang]}</span>
                  {project.links && (
                    <div className="project-detail__links">
                      {project.links.demo && (
                        <a href={project.links.demo} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                          {t.projectsPage.viewDemo} <ArrowUpRightIcon className="icon-sm" />
                        </a>
                      )}
                      {project.links.github && (
                        <a href={project.links.github} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                          <GithubIcon className="icon-sm" /> {t.projectsPage.viewCode}
                        </a>
                      )}
                      {project.links.paper && (
                        <a href={asset(project.links.paper)} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                          <FileDownIcon className="icon-sm" /> {t.projectsPage.viewPaper}
                        </a>
                      )}
                      {project.links.certificate && (
                        <a href={asset(project.links.certificate)} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                          <AwardIcon className="icon-sm" /> {t.projectsPage.viewCertificate}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
