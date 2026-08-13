import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  const { lang, t } = useLanguage();

  return (
    <Link to={`/projects#${project.id}`} className="project-card">
      <div className={`icon-badge project-card__icon accent-${project.accent}`}>
        {project.letter}
      </div>
      <span className="project-card__category">{project.category[lang]}</span>
      <h3>{project.title}</h3>
      <p className="muted project-card__summary">{project.summary[lang]}</p>
      <span className="project-card__cta">{t.work.details} →</span>
    </Link>
  );
}
