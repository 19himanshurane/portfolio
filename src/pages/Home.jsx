import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';
import { projects, socials } from '../data/content.js';
import Avatar from '../components/Avatar.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { MapPinIcon, GraduationCapIcon, GithubIcon, LinkedinIcon } from '../components/icons/ContactIcons.jsx';
import CountUp from '../components/CountUp.jsx';
import RoutingDemo from '../components/RoutingDemo.jsx';
import TiltCard from '../components/TiltCard.jsx';
import './Home.css';

const EASE = [0.32, 0.72, 0, 1];

const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const FLAGSHIP_ID = 'evalgate';

export default function Home() {
  const { lang, t } = useLanguage();
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // The photo drifts up slightly slower than the page as the hero leaves the
  // viewport, so it reads as a separate plane. Driven by useScroll, so it
  // stays on the compositor and never touches React state per frame.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const flagship = projects.find((p) => p.id === FLAGSHIP_ID);
  const otherProjects = projects.filter((p) => p.id !== FLAGSHIP_ID);

  return (
    <>
      <section className="hero" ref={heroRef}>
        <div className="container hero__grid">
          <motion.div
            className="hero__content"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <span className="eyebrow eyebrow--status">{t.hero.eyebrow}</span>
            <motion.h1 variants={heroItem} translate="no">{t.hero.name}</motion.h1>
            <motion.p variants={heroItem} className="hero__lead">{t.hero.p1}</motion.p>
            <motion.p variants={heroItem} className="muted hero__sub">{t.hero.p2}</motion.p>

            <motion.div variants={heroItem} className="hero__cta">
              <Link to="/projects" className="btn btn-primary">
                {t.hero.ctaPrimary}
                <span className="btn__icon" aria-hidden="true">→</span>
              </Link>
              <Link to="/contact" className="btn btn-secondary">{t.hero.ctaSecondary}</Link>
            </motion.div>

            <motion.div variants={heroItem} className="hero__links">
              <a href={socials.github} target="_blank" rel="noreferrer" className="hero__link">
                <GithubIcon className="icon-sm" /> GitHub
              </a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hero__link">
                <LinkedinIcon className="icon-sm" /> LinkedIn
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual"
            style={reduceMotion ? undefined : { y: photoY }}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <div className="photo-frame">
              <TiltCard className="hero__photo" tiltRange={6} shine={false}>
                <Avatar size="lg" />
              </TiltCard>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="container"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
        >
          <div className="facts">
            <div className="facts__row">
              <div className="facts__cell facts__cell--place">
                <MapPinIcon className="facts__icon" />
                <span>{t.hero.location}</span>
              </div>
              <div className="facts__cell facts__cell--place">
                <GraduationCapIcon className="facts__icon" />
                <span>{t.hero.degree}</span>
              </div>
              {t.hero.stats.map((s) => (
                <div key={s.label} className="facts__cell facts__cell--stat">
                  <span className="facts__value"><CountUp value={s.value} /></span>
                  <span className="facts__label">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="facts__tags">
              {t.hero.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="signature">
        <div className="container signature__grid">
          <Reveal y={20} className="signature__demo">
            <RoutingDemo />
          </Reveal>
          <Reveal y={20} delay={0.08} className="signature__copy">
            <h2>{t.signature.heading}</h2>
            <p className="muted signature__sub">{t.signature.sub}</p>
          </Reveal>
        </div>
      </section>

      <section className="focus">
        <div className="container focus__grid">
          <Reveal y={20} className="focus__intro">
            <h2 className="focus__heading">{t.focus.heading}</h2>
          </Reveal>
          <ol className="focus__list">
            {t.focus.items.map((item, i) => (
              <Reveal key={item.title} as="li" y={16} delay={i * 0.06} className="focus__item">
                <h3>{item.title}</h3>
                <p className="muted">{item.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="work">
        <div className="container">
          <div className="work__header">
            <Reveal y={20}>
              <h2>{t.work.heading}</h2>
            </Reveal>
            <Link to="/projects" className="work__viewall arrow-link">
              {t.work.viewAll} <span className="arrow-icon">→</span>
            </Link>
          </div>

          {flagship && (
            <Reveal y={24} className="flagship">
              <TiltCard className="flagship__card" tiltRange={2} shine={false}>
                <div className="flagship__body">
                  <span className="flagship__status">{t.flagship.status}</span>
                  <h3 className="flagship__title">{t.flagship.title}</h3>
                  <p className="muted flagship__desc">{t.flagship.desc}</p>
                  <Link to={`/projects#${FLAGSHIP_ID}`} className="btn btn-primary flagship__link">
                    {t.flagship.link}
                    <span className="btn__icon" aria-hidden="true">→</span>
                  </Link>
                </div>
                <div className="flagship__side">
                  {flagship.metric && (
                    <div className="flagship__metric">
                      <span className="flagship__metric-value">{flagship.metric.value}</span>
                      <span className="flagship__metric-label">{flagship.metric.label[lang]}</span>
                    </div>
                  )}
                  <div className="flagship__tags">
                    {t.flagship.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          )}

          <div className="work__grid">
            {otherProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="container">
          <Reveal y={20} className="contact-cta__inner">
            <h2>{t.contactCta.heading}</h2>
            <p>{t.contactCta.sub}</p>
            <Link to="/contact" className="btn btn-primary">
              {t.contactCta.button}
              <span className="btn__icon" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
