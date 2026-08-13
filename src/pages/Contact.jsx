import { useLanguage } from '../context/LanguageContext.jsx';
import { socials } from '../data/content.js';
import './Contact.css';

export default function Contact() {
  const { t } = useLanguage();

  const items = [
    { label: t.contactPage.emailLabel, value: socials.email, href: `mailto:${socials.email}` },
    { label: t.contactPage.phoneLabel, value: socials.phone, href: `tel:${socials.phone.replace(/\s+/g, '')}` },
    { label: t.contactPage.linkedinLabel, value: 'linkedin.com/in/himanshu-rane', href: socials.linkedin },
    { label: t.contactPage.githubLabel, value: 'github.com/19himanshurane', href: socials.github },
    { label: t.contactPage.locationLabel, value: t.contactPage.locationValue },
    { label: t.contactPage.availabilityLabel, value: t.contactPage.availabilityValue },
  ];

  return (
    <section className="contact-page">
      <div className="container">
        <span className="eyebrow">{t.contactPage.eyebrow}</span>
        <h1 className="contact-page__heading">{t.contactPage.heading}</h1>
        <p className="muted contact-page__sub">{t.contactPage.sub}</p>

        <div className="contact-page__grid">
          {items.map((item) => (
            <div key={item.label} className="card contact-item">
              <span className="section-label">{item.label}</span>
              {item.href ? (
                <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {item.value}
                </a>
              ) : (
                <p>{item.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="contact-page__actions">
          <a href={`mailto:${socials.email}`} className="btn btn-primary">{t.contactPage.emailButton}</a>
          <a href={socials.resume} download className="btn btn-secondary">{t.contactPage.resumeButton}</a>
        </div>
      </div>
    </section>
  );
}
