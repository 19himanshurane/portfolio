import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';
import { GithubIcon } from './icons/ContactIcons.jsx';
import './ProjectCard.css';

export default function ProjectCard({ project, index = 0 }) {
  const { lang, t } = useLanguage();
  const cardRef = useRef(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springX = useSpring(mx, { stiffness: 300, damping: 30 });
  const springY = useSpring(my, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [0, 1], [7, -7]);
  const rotateY = useTransform(springX, [0, 1], [-7, 7]);
  const shineX = useTransform(springX, (v) => `${v * 100}%`);
  const shineY = useTransform(springY, (v) => `${v * 100}%`);

  const handleMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const detailHref = `/projects#${project.id}`;
  const visibleTags = project.tags.slice(0, 4);
  const extraTags = project.tags.length - visibleTags.length;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: 1000 }}
      className="group"
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="project-card">
        <motion.span
          className="project-card__shine"
          style={{ '--shine-x': shineX, '--shine-y': shineY }}
          aria-hidden="true"
        />

        <div className="project-card__top">
          <div className={`icon-badge project-card__icon accent-${project.accent}`}>
            {project.letter}
          </div>
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="project-card__ext"
              aria-label={`${project.title} on GitHub`}
              onClick={(e) => e.stopPropagation()}
            >
              <GithubIcon className="icon-sm" />
            </a>
          )}
        </div>

        <span className="project-card__category">{project.category[lang]}</span>
        <Link to={detailHref} className="project-card__title-link">
          <h3 className="project-card__title">{project.title}</h3>
        </Link>
        <p className="muted project-card__summary">{project.summary[lang]}</p>

        {project.metric && (
          <div className="project-card__metric">
            <span className="project-card__metric-dot" aria-hidden="true" />
            <span className="project-card__metric-value">{project.metric.value}</span>
            <span className="project-card__metric-label">{project.metric.label[lang]}</span>
          </div>
        )}

        <div className="project-card__footer">
          <ul className="project-card__tags">
            {visibleTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
            {extraTags > 0 && <li className="project-card__tags-more">+{extraTags}</li>}
          </ul>
          <Link to={detailHref} className="project-card__cta arrow-link">
            {t.work.details} <span className="arrow-icon">→</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
