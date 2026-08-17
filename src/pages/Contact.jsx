import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { socials } from '../data/content.js';
import { asset } from '../utils/asset.js';
import Reveal from '../components/Reveal.jsx';
import {
  MailIcon,
  PhoneIcon,
  LinkedinIcon,
  GithubIcon,
  ArrowUpRightIcon,
  MapPinIcon,
  MessageSquareIcon,
  FileDownIcon,
  CopyIcon,
  CheckIcon,
} from '../components/icons/ContactIcons.jsx';
import './Contact.css';

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard API unavailable — no-op
    }
  };

  return (
    <button type="button" className="copy-btn" onClick={handleCopy} aria-label={label}>
      {copied ? <CheckIcon className="icon-sm" /> : <CopyIcon className="icon-sm" />}
    </button>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contactPage;

  return (
    <section className="contact-page">
      <div className="container">
        <Reveal y={20} className="contact-page__header">
          <span className="eyebrow contact-page__eyebrow">{c.eyebrow}</span>
          <h1>{c.heading}</h1>
          <p className="contact-page__sub">{c.sub}</p>
        </Reveal>

        <div className="contact-page__grid">
          <Reveal y={30} className="contact-stack">
            <a href={`mailto:${socials.email}`} className="contact-card contact-card--dark">
              <div className="contact-card__icon contact-card__icon--dark">
                <MailIcon className="icon-md" />
              </div>
              <div className="contact-card__text">
                <p className="contact-card__label contact-card__label--dark">{c.emailLabel}</p>
                <p className="contact-card__value contact-card__value--dark">{socials.email}</p>
              </div>
              <CopyButton value={socials.email} label={c.copyEmail} />
              <ArrowUpRightIcon className="contact-card__arrow contact-card__arrow--dark" />
            </a>

            <a href={`tel:${socials.phone.replace(/\s+/g, '')}`} className="contact-card contact-card--light">
              <div className="contact-card__icon contact-card__icon--light">
                <PhoneIcon className="icon-md" />
              </div>
              <div className="contact-card__text">
                <p className="contact-card__label">{c.phoneLabel}</p>
                <p className="contact-card__value">{socials.phone}</p>
              </div>
              <CopyButton value={socials.phone} label={c.copyPhone} />
              <ArrowUpRightIcon className="contact-card__arrow" />
            </a>

            <a href={socials.linkedin} target="_blank" rel="noreferrer" className="contact-card contact-card--light">
              <div className="contact-card__icon contact-card__icon--light">
                <LinkedinIcon className="icon-md" />
              </div>
              <div className="contact-card__text">
                <p className="contact-card__label">{c.linkedinLabel}</p>
                <p className="contact-card__value">himanshu-rane</p>
              </div>
              <ArrowUpRightIcon className="contact-card__arrow" />
            </a>

            <a href={socials.github} target="_blank" rel="noreferrer" className="contact-card contact-card--light">
              <div className="contact-card__icon contact-card__icon--light">
                <GithubIcon className="icon-md" />
              </div>
              <div className="contact-card__text">
                <p className="contact-card__label">{c.githubLabel}</p>
                <p className="contact-card__value">19himanshurane</p>
              </div>
              <ArrowUpRightIcon className="contact-card__arrow" />
            </a>

            <a href={asset(socials.resume)} download className="contact-card contact-card--resume">
              <div className="contact-card__icon contact-card__icon--light">
                <FileDownIcon className="icon-sm" />
              </div>
              <div className="contact-card__text">
                <p className="contact-card__label contact-card__label--xs">{c.downloadLabel}</p>
                <p className="contact-card__value contact-card__value--sm">{c.resumeFile}</p>
              </div>
              <ArrowUpRightIcon className="contact-card__arrow contact-card__arrow--sm" />
            </a>
          </Reveal>

          <Reveal y={30} delay={0.1} className="contact-side">
            <div className="quick-info">
              <h3>{c.quickInfo}</h3>
              <div className="quick-info__rows">
                <div className="quick-info__row">
                  <div className="quick-info__icon">
                    <MapPinIcon className="icon-md quick-info__icon-svg" />
                  </div>
                  <div>
                    <p className="quick-info__label">{c.locationLabel}</p>
                    <p className="quick-info__value">{c.locationValue}</p>
                  </div>
                </div>

                <div className="quick-info__row">
                  <div className="quick-info__icon">
                    <MessageSquareIcon className="icon-md quick-info__icon-svg" />
                  </div>
                  <div>
                    <p className="quick-info__label">{c.languagesLabel}</p>
                    <p className="quick-info__value">{c.englishLine}</p>
                    <p className="quick-info__value-sub">{c.germanLine}</p>
                  </div>
                </div>

                <div className="quick-info__availability">
                  <p className="quick-info__label">{c.availabilityLabel}</p>
                  <div className="quick-info__status">
                    <span className="quick-info__dot" />
                    <span className="quick-info__status-text">{c.availabilityValue}</span>
                  </div>
                  <p className="quick-info__roles">{c.availabilityRoles}</p>
                </div>
              </div>
            </div>

            <div className="interests-card">
              <p className="quick-info__label">{c.interestsHeading}</p>
              <div className="interests-card__tags">
                {c.interests.map((item) => (
                  <span key={item} className="interests-card__tag">{item}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
