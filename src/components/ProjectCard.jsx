import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';
import './ProjectCard.css';

export default function ProjectCard({ project, index = 0 }) {
  const { lang, t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link to={`/projects#${project.id}`} className="project-card">
        <div className={`icon-badge project-card__icon accent-${project.accent}`}>
          {project.letter}
        </div>
        <span className="project-card__category">{project.category[lang]}</span>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="muted project-card__summary">{project.summary[lang]}</p>
        <span className="project-card__cta arrow-link">
          {t.work.details} <span className="arrow-icon">→</span>
        </span>
      </Link>
    </motion.div>
  );
}
