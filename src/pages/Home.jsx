import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';
import { projects, socials } from '../data/content.js';
import Avatar from '../components/Avatar.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { MapPinIcon, GraduationCapIcon, GithubIcon, LinkedinIcon } from '../components/icons/ContactIcons.jsx';
import HeroIllustration from '../components/HeroIllustration.jsx';
import AccentLine from '../components/AccentLine.jsx';
import CountUp from '../components/CountUp.jsx';
import RoutingDemo from '../components/RoutingDemo.jsx';
import TiltCard from '../components/TiltCard.jsx';
import LiveClock from '../components/LiveClock.jsx';
import './Home.css';

const EASE = [0.4, 0, 0.2, 1];

const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function Home() {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Hero depth: the photo and the info panel leave the viewport at slightly
  // different rates, so the two read as separate planes rather than one flat
  // column. Driven by useScroll rather than a scroll listener, so it stays on
  // the compositor and never touches React state per frame.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -14]);

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
            <motion.h1 variants={heroItem}>{t.hero.name}</motion.h1>
            <motion.p variants={heroItem} className="hero__lead">{t.hero.p1}</motion.p>
            <motion.p variants={heroItem} className="muted hero__sub">{t.hero.p2}</motion.p>

            <motion.div variants={heroItem} className="hero__cta">
              <Link to="/projects" className="btn btn-primary">{t.hero.ctaPrimary}</Link>
              <Link to="/contact" className="btn btn-secondary">{t.hero.ctaSecondary}</Link>
            </motion.div>

            <motion.div variants={heroItem} className="hero__links">
              <a href={socials.github} target="_blank" rel="noreferrer" className="social-pill">
                <GithubIcon className="icon-sm" /> GitHub
              </a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="social-pill">
                <LinkedinIcon className="icon-sm" /> LinkedIn
              </a>
            </motion.div>

            <motion.div variants={heroItem} className="hero__tags">
              {t.hero.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </motion.div>
          </motion.div>

          <div className="hero__visual">
            <motion.div style={reduceMotion ? undefined : { y: photoY }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              >
                <TiltCard className="hero__photo" tiltRange={8} shine={false}>
                  <Avatar size="lg" />
                </TiltCard>
              </motion.div>
            </motion.div>

            <motion.div style={reduceMotion ? undefined : { y: panelY }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
              >
                <TiltCard className="hero__info-card" tiltRange={5}>
                  <div className="hero__info-bar">
                    <LiveClock className="hero__info-clock" tz={t.hero.tz} />
                  </div>
                  <div className="hero__info-rows">
                    <div className="hero__info-row">
                      <span className="hero__status-dot" />
                      {t.hero.eyebrow}
                    </div>
                    <div className="hero__info-row">
                      <MapPinIcon className="hero__info-icon" />
                      {t.hero.location}
                    </div>
                    <div className="hero__info-row">
                      <GraduationCapIcon className="hero__info-icon" />
                      {t.hero.degree}
                    </div>
                  </div>
                  <div className="hero__stats">
                    {t.hero.stats.map((s) => (
                      <div key={s.label} className="hero__stat">
                        <span className="hero__stat-value"><CountUp value={s.value} /></span>
                        <span className="hero__stat-label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="signature">
        <div className="container signature__grid">
          <Reveal y={20}>
            <h2>{t.signature.heading}</h2>
            <p className="muted signature__sub">{t.signature.sub}</p>
          </Reveal>
          <Reveal y={24} delay={0.1}>
            <RoutingDemo />
          </Reveal>
        </div>
      </section>

      <section className="about-preview">
        <div className="container about-preview__grid">
          <Reveal y={20}>
            <HeroIllustration />
          </Reveal>
          <Reveal y={20} delay={0.1}>
            <p className="about-preview__intro">{t.aboutPreview.intro}</p>
            <p className="muted">{t.aboutPreview.body}</p>
          </Reveal>
        </div>
      </section>

      <section className="focus">
        <div className="container">
          <Reveal y={20}>
            <span className="section-label">{t.focus.label}</span>
            <h2 className="focus__heading">{t.focus.heading}</h2>
            <AccentLine />
          </Reveal>
          <div className="grid grid-3 focus__grid">
            {t.focus.items.map((item, i) => (
              <Reveal key={item.title} y={24} delay={i * 0.1}>
                <TiltCard className="card focus__item" tiltRange={5}>
                  <h3>{item.title}</h3>
                  <p className="muted">{item.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="flagship">
        <div className="container">
          <Reveal y={28} delay={0.1}>
            <TiltCard className="flagship__card" tiltRange={3}>
              <div className="flagship__body">
                <h2>{t.flagship.title}</h2>
                <p className="muted">{t.flagship.desc}</p>
                <div className="flagship__tags">
                  {t.flagship.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <Link to="/projects#evalgate" className="flagship__link arrow-link">
                  {t.flagship.link} <span className="arrow-icon">→</span>
                </Link>
              </div>
              <div className="flagship__status">{t.flagship.status}</div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="work">
        <div className="container">
          <div className="work__header">
            <Reveal y={20} className="work__title-row">
              <span className="section-label">{t.work.label}</span>
              <div className="work__heading-line">
                <h2>{t.work.heading}</h2>
                <span className="work__rule" aria-hidden="true" />
              </div>
            </Reveal>
            <Link to="/projects" className="work__viewall arrow-link">{t.work.viewAll} <span className="arrow-icon">→</span></Link>
          </div>
          <div className="grid grid-3">
            {projects.map((project, i) => (
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
            <Link to="/contact" className="btn btn-cta arrow-link">
              {t.contactCta.button} <span className="arrow-icon">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
